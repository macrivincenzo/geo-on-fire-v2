import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { Autumn } from 'autumn-js';
import { executeBoostAction, ActionExecutionContext } from '@/lib/action-executor';
import { ActionItem } from '@/lib/strategic-insights';
import { CompetitorRanking, AIResponse } from '@/lib/types';
import { handleApiError, InsufficientCreditsError, ExternalServiceError } from '@/lib/api-errors';
import { FEATURE_ID_MESSAGES, CREDITS_PER_ACTION } from '@/config/constants';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

const autumn = new Autumn({
  apiKey: process.env.AUTUMN_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      return Response.json(
        { error: 'Please log in to execute actions' },
        { status: 401 }
      );
    }

    // Check if user has enough credits (5 credits per action)
    try {
      console.log('[Execute Action] Checking access - Customer ID:', sessionResponse.user.id);
      const access = await autumn.check({
        customer_id: sessionResponse.user.id,
        feature_id: FEATURE_ID_MESSAGES,
      });
      console.log('[Execute Action] Access check result:', JSON.stringify(access.data, null, 2));
      
      if (!access.data?.allowed || (access.data?.balance && access.data.balance < CREDITS_PER_ACTION)) {
        console.log('[Execute Action] Insufficient credits - Balance:', access.data?.balance, 'Required:', CREDITS_PER_ACTION);
        return Response.json(
          { 
            success: false,
            error: 'Insufficient credits',
            message: `You need at least ${CREDITS_PER_ACTION} credits to execute this action. You currently have ${access.data?.balance || 0} credits.`,
            creditsRequired: CREDITS_PER_ACTION,
            creditsAvailable: access.data?.balance || 0
          },
          { status: 402 } // 402 Payment Required
        );
      }
    } catch (err) {
      console.error('[Execute Action] Failed to check access:', err);
      return Response.json(
        { 
          success: false,
          error: 'Unable to verify credits. Please try again',
          message: 'Unable to verify credits. Please try again'
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      action,
      brandName,
      brandData,
      competitors,
      responses,
      brandUrl
    } = body;

    // Validate required fields
    if (!action || !brandName || !brandData) {
      return Response.json(
        { error: 'Missing required fields: action, brandName, brandData' },
        { status: 400 }
      );
    }

    // Build execution context
    const context: ActionExecutionContext = {
      action: action as ActionItem,
      brandName: brandName as string,
      brandData: brandData as CompetitorRanking,
      competitors: (competitors || []) as CompetitorRanking[],
      responses: (responses || []) as AIResponse[],
      brandUrl: brandUrl as string | undefined
    };

    // Track usage with Autumn (deduct credits) BEFORE executing
    try {
      console.log('[Execute Action] Tracking usage - Customer ID:', sessionResponse.user.id, 'Count:', CREDITS_PER_ACTION);
      const trackResult = await autumn.track({
        customer_id: sessionResponse.user.id,
        feature_id: FEATURE_ID_MESSAGES,
        value: CREDITS_PER_ACTION, // FIXED: Use 'value' not 'count'!
      });
      console.log('[Execute Action] Usage tracked successfully:', JSON.stringify(trackResult, null, 2));
    } catch (err) {
      console.error('[Execute Action] Failed to track usage:', err);
      if (err instanceof Error) {
        console.error('[Execute Action] Error details:', {
          message: err.message,
          stack: err.stack,
          response: (err as any).response?.data
        });
      }
      return Response.json(
        { 
          success: false,
          error: 'Unable to process credit deduction. Please try again',
          message: 'Unable to process credit deduction. Please try again'
        },
        { status: 500 }
      );
    }

    // Get remaining credits after deduction
    let remainingCredits = 0;
    try {
      const usage = await autumn.check({
        customer_id: sessionResponse.user.id,
        feature_id: FEATURE_ID_MESSAGES,
      });
      remainingCredits = usage.data?.balance || 0;
      console.log('[Execute Action] Remaining credits after deduction:', remainingCredits);
    } catch (err) {
      console.error('[Execute Action] Failed to get remaining credits:', err);
    }

    // Execute the action
    console.log(`[Execute Action] Executing action ${action.id} for brand ${brandName}`, {
      category: action.category,
      brandUrl: brandUrl || 'not provided'
    });
    
    const result = await executeBoostAction(context);

    if (!result.success) {
      console.error('[Execute Action] Action execution failed:', {
        actionId: action.id,
        error: result.error,
        message: result.message
      });
      return Response.json(
        { 
          error: result.error || 'Action execution failed',
          message: result.message 
        },
        { status: 500 }
      );
    }

    console.log(`[Execute Action] Successfully executed action ${action.id}`);
    console.log(`[Execute Action] Generated content count: ${result.generatedContent?.length || 0}`);
    
    const response = {
      success: true,
      message: result.message,
      data: result.data,
      generatedContent: result.generatedContent || [],
      creditsUsed: CREDITS_PER_ACTION,
      remainingCredits: remainingCredits
    };
    
    console.log(`[Execute Action] Response includes ${response.generatedContent.length} piece(s) of content`);
    
    return Response.json(response);

  } catch (error) {
    console.error('[Execute Action] Unexpected error:', error);
    console.error('[Execute Action] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return handleApiError(error);
  }
}
