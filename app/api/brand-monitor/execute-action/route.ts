import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { executeBoostAction, ActionExecutionContext } from '@/lib/action-executor';
import { ActionItem } from '@/lib/strategic-insights';
import { CompetitorRanking, AIResponse } from '@/lib/types';
import { handleApiError } from '@/lib/api-errors';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

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
    return Response.json({
      success: true,
      message: result.message,
      data: result.data,
      creditsUsed: result.creditsUsed || 0
    });

  } catch (error) {
    console.error('[Execute Action] Unexpected error:', error);
    console.error('[Execute Action] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return handleApiError(error);
  }
}
