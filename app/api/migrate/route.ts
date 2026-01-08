import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// This is a one-time migration endpoint
// After running once, you should delete this file for security
export async function POST(request: NextRequest) {
  try {
    // Security: Only allow in development or with a secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Use a strong secret or only allow in development
    if (process.env.NODE_ENV === 'production' && secret !== process.env.MIGRATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    console.log('Running database migration...');

    // Run the migration SQL
    const migrationSQL = `
      -- Create custom types
      DO $$ BEGIN
          CREATE TYPE "role" AS ENUM('user', 'assistant');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
          CREATE TYPE "theme" AS ENUM('light', 'dark');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;

      -- Brand Monitor Analyses
      CREATE TABLE IF NOT EXISTS "brand_analyses" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" text NOT NULL,
          "url" text NOT NULL,
          "company_name" text,
          "industry" text,
          "analysis_data" jsonb,
          "competitors" jsonb,
          "prompts" jsonb,
          "credits_used" integer DEFAULT 10,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
      );

      -- Chat Conversations
      CREATE TABLE IF NOT EXISTS "conversations" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" text NOT NULL,
          "title" text,
          "last_message_at" timestamp,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
      );

      -- Chat Messages
      CREATE TABLE IF NOT EXISTS "messages" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "conversation_id" uuid NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
          "user_id" text NOT NULL,
          "role" "role" NOT NULL,
          "content" text NOT NULL,
          "token_count" integer,
          "created_at" timestamp DEFAULT now()
      );

      -- Message Feedback
      CREATE TABLE IF NOT EXISTS "message_feedback" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "message_id" uuid NOT NULL REFERENCES "messages"("id") ON DELETE CASCADE,
          "user_id" text NOT NULL,
          "rating" integer,
          "feedback" text,
          "created_at" timestamp DEFAULT now()
      );

      -- User Profile
      CREATE TABLE IF NOT EXISTS "user_profile" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" text NOT NULL UNIQUE,
          "display_name" text,
          "avatar_url" text,
          "bio" text,
          "phone" text,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
      );

      -- User Settings
      CREATE TABLE IF NOT EXISTS "user_settings" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" text NOT NULL UNIQUE,
          "theme" "theme" DEFAULT 'light',
          "email_notifications" boolean DEFAULT true,
          "marketing_emails" boolean DEFAULT false,
          "default_model" text DEFAULT 'gpt-3.5-turbo',
          "metadata" jsonb,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
      );

      -- Source Domains - Track which domains cite the brand
      CREATE TABLE IF NOT EXISTS "source_domains" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "brand_analysis_id" uuid NOT NULL REFERENCES "brand_analyses"("id") ON DELETE CASCADE,
          "domain" text NOT NULL,
          "domain_name" text,
          "times_cited" integer DEFAULT 0,
          "share_of_citations" integer,
          "category" text,
          "created_at" timestamp DEFAULT now()
      );

      -- Source Pages - Track specific pages that cite the brand
      CREATE TABLE IF NOT EXISTS "source_pages" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "brand_analysis_id" uuid NOT NULL REFERENCES "brand_analyses"("id") ON DELETE CASCADE,
          "domain_id" uuid REFERENCES "source_domains"("id") ON DELETE CASCADE,
          "url" text NOT NULL,
          "title" text,
          "times_cited" integer DEFAULT 0,
          "share_of_citations" integer,
          "created_at" timestamp DEFAULT now()
      );

      -- Brand Analysis Snapshots - Historical tracking of metrics over time
      CREATE TABLE IF NOT EXISTS "brand_analysis_snapshots" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "brand_analysis_id" uuid NOT NULL REFERENCES "brand_analyses"("id") ON DELETE CASCADE,
          "visibility_score" integer,
          "sentiment_score" integer,
          "share_of_voice" integer,
          "average_position" integer,
          "rank" integer,
          "snapshot_date" timestamp DEFAULT now(),
          "created_at" timestamp DEFAULT now()
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS "idx_brand_analyses_user_id" ON "brand_analyses"("user_id");
      CREATE INDEX IF NOT EXISTS "idx_conversations_user_id" ON "conversations"("user_id");
      CREATE INDEX IF NOT EXISTS "idx_messages_conversation_id" ON "messages"("conversation_id");
      CREATE INDEX IF NOT EXISTS "idx_messages_user_id" ON "messages"("user_id");
      CREATE INDEX IF NOT EXISTS "idx_message_feedback_message_id" ON "message_feedback"("message_id");
      CREATE INDEX IF NOT EXISTS "idx_source_domains_brand_analysis_id" ON "source_domains"("brand_analysis_id");
      CREATE INDEX IF NOT EXISTS "idx_source_domains_domain" ON "source_domains"("domain");
      CREATE INDEX IF NOT EXISTS "idx_source_pages_brand_analysis_id" ON "source_pages"("brand_analysis_id");
      CREATE INDEX IF NOT EXISTS "idx_source_pages_domain_id" ON "source_pages"("domain_id");
      CREATE INDEX IF NOT EXISTS "idx_brand_analysis_snapshots_brand_analysis_id" ON "brand_analysis_snapshots"("brand_analysis_id");
      CREATE INDEX IF NOT EXISTS "idx_brand_analysis_snapshots_snapshot_date" ON "brand_analysis_snapshots"("snapshot_date");
    `;

    await pool.query(migrationSQL);

    console.log('Migration completed successfully!');

    await pool.end();

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully!',
      tables: [
        'brand_analyses',
        'conversations',
        'messages',
        'message_feedback',
        'user_profile',
        'user_settings',
        'source_domains',
        'source_pages',
        'brand_analysis_snapshots'
      ]
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
