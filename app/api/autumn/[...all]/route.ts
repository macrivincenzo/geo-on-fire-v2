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
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        console.log('[Autumn] No session - anonymous user');
        return null;
      }

      // Return the customer information for Autumn
      console.log('[Autumn] Identified user:', session.user.id);
      return {
        customerId: session.user.id,
        customerData: {
          name: session.user.name,
          email: session.user.email,
        },
      };
    } catch (error) {
      console.error('[Autumn] Error in identify:', error);
      return null;
    }
  },
  billingPortalConfig: {
    business_name: "AI Brand Track",
    privacy_policy_url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy`,
    terms_of_service_url: `${process.env.NEXT_PUBLIC_APP_URL}/terms`,
  },
});