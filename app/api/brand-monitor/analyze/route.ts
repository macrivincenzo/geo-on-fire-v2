import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { Autumn } from 'autumn-js';
import { performAnalysis, createSSEMessage } from '@/lib/analyze-common';
import { SSEEvent } from '@/lib/types';
import { 
  AuthenticationError, 
  InsufficientCreditsError, 
  ValidationError, 
  ExternalServiceError, 
  handleApiError 
} from '@/lib/api-errors';
import { 
  FEATURE_ID_MESSAGES, 
  CREDITS_PER_BRAND_ANALYSIS,
  ERROR_MESSAGES,
  SSE_MAX_DURATION
} from '@/config/constants';

const autumn = new Autumn({
  apiKey: process.env.AUTUMN_SECRET_KEY!,
});

export const runtime = 'nodejs'; // Use Node.js runtime for streaming
export const maxDuration = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError('Please log in to use brand monitor');
    }

    // Check if user has enough credits (10 credits per analysis)
    try {
      console.log('[Brand Monitor] Checking access - Customer ID:', sessionResponse.user.id);
      const access = await autumn.check({
        customer_id: sessionResponse.user.id,
        feature_id: FEATURE_ID_MESSAGES,
      });
      console.log('[Brand Monitor] Access check result:', JSON.stringify(access.data, null, 2));
      
      if (!access.data?.allowed || (access.data?.balance && access.data.balance < CREDITS_PER_BRAND_ANALYSIS)) {
        console.log('[Brand Monitor] Insufficient credits - Balance:', access.data?.balance);
        throw new InsufficientCreditsError(
          ERROR_MESSAGES.INSUFFICIENT_CREDITS_BRAND_ANALYSIS,
          CREDITS_PER_BRAND_ANALYSIS,
          access.data?.balance || 0
        );
      }
    } catch (err) {
      console.error('[Brand Monitor] Failed to check access:', err);
      throw new ExternalServiceError('Unable to verify credits. Please try again', 'autumn');
    }

    const { company, prompts: customPrompts, competitors: userSelectedCompetitors, useWebSearch = false } = await request.json();

    if (!company || !company.name) {
      throw new ValidationError(ERROR_MESSAGES.COMPANY_INFO_REQUIRED, {
        company: 'Company name is required'
      });
    }

    // Track usage with Autumn (deduct credits) - ONLY ONCE
    try {
      console.log('[Brand Monitor] Tracking usage - Customer ID:', sessionResponse.user.id, 'Count:', CREDITS_PER_BRAND_ANALYSIS);
      const trackResult = await autumn.track({
        customer_id: sessionResponse.user.id,
        feature_id: FEATURE_ID_MESSAGES,
        count: CREDITS_PER_BRAND_ANALYSIS,
      });
      console.log('[Brand Monitor] Usage tracked successfully:', JSON.stringify(trackResult, null, 2));
    } catch (err) {
      console.error('[Brand Monitor] Failed to track usage:', err);
      if (err instanceof Error) {
        console.error('[Brand Monitor] Error details:', {
          message: err.message,
          stack: err.stack,
          response: (err as any).response?.data
        });
      }
      throw new ExternalServiceError('Unable to process credit deduction. Please try again', 'autumn');
    }

    // Get remaining credits after deduction
    let remainingCredits = 0;
    try {
      const usage = await autumn.check({
        customer_id: sessionResponse.user.id,
        feature_id: FEATURE_ID_MESSAGES,
      });
      remainingCredits = usage.data?.balance || 0;
    } catch (err) {
      console.error('Failed to get remaining credits:', err);
    }

    // Create a TransformStream for SSE
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Function to send SSE events
    const sendEvent = async (event: SSEEvent) => {
      await writer.write(encoder.encode(createSSEMessage(event)));
    };

    // Start the async processing
    (async () => {
      try {
        // Send initial credit info
        try {
          await sendEvent({
            type: 'credits',
            stage: 'credits',
            data: {
              remainingCredits,
              creditsUsed: CREDITS_PER_BRAND_ANALYSIS
            },
            timestamp: new Date()
          });
        } catch (eventError) {
          console.warn('Failed to send credits event:', eventError);
          // Continue anyway
        }

        // Perform the analysis using common logic
        let analysisResult;
        try {
          analysisResult = await performAnalysis({
            company,
            customPrompts,
            userSelectedCompetitors,
            useWebSearch,
            sendEvent
          });
        } catch (analysisError) {
          console.error('Analysis failed:', analysisError);
          const errorMessage = analysisError instanceof Error 
            ? analysisError.message 
            : 'Analysis failed with unknown error';
          
          await sendEvent({
            type: 'error',
            stage: 'error',
            data: {
              message: errorMessage,
              details: process.env.NODE_ENV === 'development' 
                ? (analysisError instanceof Error ? analysisError.stack : String(analysisError))
                : undefined
            },
            timestamp: new Date()
          });
          return; // Exit early on analysis failure
        }

        // Send final complete event with all data
        try {
          await sendEvent({
            type: 'complete',
            stage: 'finalizing',
            data: {
              analysis: analysisResult
            },
            timestamp: new Date()
          });
        } catch (eventError) {
          console.warn('Failed to send complete event:', eventError);
          // Continue to close writer
        }
      } catch (error) {
        console.error('Unexpected error in analysis process:', error);
        try {
          await sendEvent({
            type: 'error',
            stage: 'error',
            data: {
              message: error instanceof Error ? error.message : 'Unexpected error occurred',
              details: process.env.NODE_ENV === 'development' 
                ? (error instanceof Error ? error.stack : String(error))
                : undefined
            },
            timestamp: new Date()
          });
        } catch (eventError) {
          console.error('Failed to send error event:', eventError);
        }
      } finally {
        try {
          await writer.close();
        } catch (closeError) {
          console.error('Failed to close writer:', closeError);
        }
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    // For SSE endpoints, we need to return a proper error response
    // instead of using handleApiError which returns NextResponse
    console.error('Brand monitor analyze API error:', error);
    
    if (error instanceof AuthenticationError ||
        error instanceof InsufficientCreditsError ||
        error instanceof ValidationError ||
        error instanceof ExternalServiceError) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            timestamp: new Date().toISOString(),
            metadata: error instanceof InsufficientCreditsError ? {
              creditsRequired: error.creditsRequired,
              creditsAvailable: error.creditsAvailable
            } : undefined
          }
        }),
        { 
          status: error.statusCode, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        error: {
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
          timestamp: new Date().toISOString()
        }
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}