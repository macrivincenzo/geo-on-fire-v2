import { autumnHandler } from "autumn-js/next";
import { auth } from "@/lib/auth";

// Validate AUTUMN_SECRET_KEY is set
if (!process.env.AUTUMN_SECRET_KEY) {
  console.error('[Autumn] AUTUMN_SECRET_KEY is not set in environment variables');
}

export const { GET, POST } = autumnHandler({
  apiKey: process.env.AUTUMN_SECRET_KEY,
  identify: async (request) => {
    try {
      // Get session with proper headers
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user?.id) {
        console.log('[Autumn] No session or user ID - anonymous user');
        return null;
      }

      // Ensure we have a valid customerId
      const customerId = session.user.id;
      if (!customerId) {
        console.error('[Autumn] Session exists but customerId is missing');
        return null;
      }

      // Return the customer information for Autumn
      console.log('[Autumn] Identified user:', customerId);
      const customerInfo = {
        customerId: customerId,
        customerData: {
          name: session.user.name || undefined,
          email: session.user.email || undefined,
        },
      };
      
      console.log('[Autumn] Returning customer info:', { customerId, hasEmail: !!customerInfo.customerData.email });
      return customerInfo;
    } catch (error) {
      console.error('[Autumn] Error in identify function:', error);
      if (error instanceof Error) {
        console.error('[Autumn] Error details:', error.message, error.stack);
      }
      return null;
    }
  },
  billingPortalConfig: {
    business_name: "AI Brand Track",
    privacy_policy_url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy`,
    terms_of_service_url: `${process.env.NEXT_PUBLIC_APP_URL}/terms`,
  },
});