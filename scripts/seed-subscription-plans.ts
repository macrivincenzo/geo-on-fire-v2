import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedSubscriptionPlans() {
  try {
    console.log('🌱 Seeding subscription plans...');

    const plans = [
      {
        name: 'starter',
        display_name: 'Starter',
        price_monthly: 3900, // $39.00 in cents
        credits_per_month: 50,
        features: {
          projects: 1,
          brands: 1,
          content_generation: {
            limit: 2,
            types: ['blog', 'comparison'],
          },
          tracking_features: ['visibility', 'ranking', 'source_tracker'],
        },
        is_active: true,
      },
      {
        name: 'pro',
        display_name: 'Pro',
        price_monthly: 6900, // $69.00 in cents
        credits_per_month: 150,
        features: {
          projects: -1, // unlimited
          brands: -1, // unlimited
          content_generation: {
            limit: -1, // unlimited
            types: ['blog', 'comparison', 'faq', 'landing_page', 'technical_guide'],
          },
          tracking_features: [
            'visibility',
            'sentiment',
            'share_of_voice',
            'ranking',
            'source_tracker',
            'domain_comparisons',
            'historical_tracking',
          ],
          dataforseo: true,
          priority_support: true,
        },
        is_active: true,
      },
      {
        name: 'enterprise',
        display_name: 'Enterprise',
        price_monthly: 0, // Custom pricing
        credits_per_month: -1, // unlimited
        features: {
          projects: -1,
          brands: -1,
          content_generation: {
            limit: -1,
          },
          tracking_features: 'all',
          dataforseo: true,
          api_access: true,
          dedicated_support: true,
          white_label: true,
        },
        is_active: true,
      },
    ];

    for (const plan of plans) {
      const result = await pool.query(
        `INSERT INTO subscription_plans (name, display_name, price_monthly, credits_per_month, features, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name) DO UPDATE SET
           display_name = EXCLUDED.display_name,
           price_monthly = EXCLUDED.price_monthly,
           credits_per_month = EXCLUDED.credits_per_month,
           features = EXCLUDED.features,
           is_active = EXCLUDED.is_active,
           updated_at = NOW()
         RETURNING *`,
        [plan.name, plan.display_name, plan.price_monthly, plan.credits_per_month, JSON.stringify(plan.features), plan.is_active]
      );

      console.log(`✅ Seeded plan: ${plan.display_name} (${plan.name})`);
    }

    console.log('✅ All subscription plans seeded successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
    await pool.end();
    process.exit(1);
  }
}

seedSubscriptionPlans();
