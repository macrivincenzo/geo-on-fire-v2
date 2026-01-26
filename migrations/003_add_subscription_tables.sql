-- Migration: Add Subscription Tables
-- Date: 2026-01-23
-- Description: Adds tables for subscription plans, user subscriptions, Stripe integration, and subscription history

-- Subscription Plans - Define available subscription tiers
CREATE TABLE IF NOT EXISTS "subscription_plans" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" varchar(50) NOT NULL UNIQUE, -- 'starter', 'pro', 'enterprise'
    "display_name" varchar(100) NOT NULL,
    "price_monthly" integer NOT NULL, -- Store as cents (3900 = $39.00)
    "credits_per_month" integer NOT NULL,
    "features" jsonb,
    "stripe_price_id" varchar(255),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- User Subscriptions - Track active user subscriptions
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" text NOT NULL,
    "plan_id" uuid NOT NULL REFERENCES "subscription_plans"("id"),
    "stripe_subscription_id" varchar(255) UNIQUE,
    "stripe_customer_id" varchar(255),
    "status" varchar(50) NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing', 'incomplete'
    "current_period_start" timestamp,
    "current_period_end" timestamp,
    "cancel_at_period_end" boolean DEFAULT false,
    "credits_allocated_this_month" integer DEFAULT 0,
    "last_credit_allocation" timestamp,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Stripe Customers - Map users to Stripe customer IDs
CREATE TABLE IF NOT EXISTS "stripe_customers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" text NOT NULL UNIQUE,
    "stripe_customer_id" varchar(255) NOT NULL UNIQUE,
    "created_at" timestamp DEFAULT now()
);

-- Subscription History - Audit trail for subscription changes
CREATE TABLE IF NOT EXISTS "subscription_history" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" text NOT NULL,
    "subscription_id" uuid REFERENCES "user_subscriptions"("id"),
    "event_type" varchar(50) NOT NULL, -- 'created', 'updated', 'canceled', 'renewed', 'credit_allocated'
    "old_plan_id" uuid REFERENCES "subscription_plans"("id"),
    "new_plan_id" uuid REFERENCES "subscription_plans"("id"),
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_subscriptions_user_id" ON "user_subscriptions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_subscriptions_status" ON "user_subscriptions"("status");
CREATE INDEX IF NOT EXISTS "idx_user_subscriptions_stripe_subscription_id" ON "user_subscriptions"("stripe_subscription_id");
CREATE INDEX IF NOT EXISTS "idx_stripe_customers_user_id" ON "stripe_customers"("user_id");
CREATE INDEX IF NOT EXISTS "idx_stripe_customers_stripe_customer_id" ON "stripe_customers"("stripe_customer_id");
CREATE INDEX IF NOT EXISTS "idx_subscription_history_user_id" ON "subscription_history"("user_id");
CREATE INDEX IF NOT EXISTS "idx_subscription_history_subscription_id" ON "subscription_history"("subscription_id");

-- Note: Default subscription plans are seeded using the seed script
-- Run: npm run seed:plans
