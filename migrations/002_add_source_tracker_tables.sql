-- Migration: Add Source Tracker and Historical Tracking tables
-- Date: 2026-01-06
-- Description: Adds tables for tracking citation sources and historical snapshots

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
CREATE INDEX IF NOT EXISTS "idx_source_domains_brand_analysis_id" ON "source_domains"("brand_analysis_id");
CREATE INDEX IF NOT EXISTS "idx_source_domains_domain" ON "source_domains"("domain");
CREATE INDEX IF NOT EXISTS "idx_source_pages_brand_analysis_id" ON "source_pages"("brand_analysis_id");
CREATE INDEX IF NOT EXISTS "idx_source_pages_domain_id" ON "source_pages"("domain_id");
CREATE INDEX IF NOT EXISTS "idx_brand_analysis_snapshots_brand_analysis_id" ON "brand_analysis_snapshots"("brand_analysis_id");
CREATE INDEX IF NOT EXISTS "idx_brand_analysis_snapshots_snapshot_date" ON "brand_analysis_snapshots"("snapshot_date");

