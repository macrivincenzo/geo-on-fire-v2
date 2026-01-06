import { pgTable, text, timestamp, uuid, boolean, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['user', 'assistant']);
export const themeEnum = pgEnum('theme', ['light', 'dark']);

// User Profile table - extends Better Auth user with additional fields
export const userProfile = pgTable('user_profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// Conversations table - stores chat threads
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  title: text('title'),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// Messages table - stores individual chat messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  tokenCount: integer('token_count'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Message Feedback table - for rating AI responses
export const messageFeedback = pgTable('message_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  rating: integer('rating'), // 1-5
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Settings table - app-specific preferences
export const userSettings = pgTable('user_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(),
  theme: themeEnum('theme').default('light'),
  emailNotifications: boolean('email_notifications').default(true),
  marketingEmails: boolean('marketing_emails').default(false),
  defaultModel: text('default_model').default('gpt-3.5-turbo'),
  metadata: jsonb('metadata'), // For any additional settings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// Define relations without user table reference
export const userProfileRelations = relations(userProfile, ({ many }) => ({
  conversations: many(conversations),
  brandAnalyses: many(brandAnalyses),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  userProfile: one(userProfile, {
    fields: [conversations.userId],
    references: [userProfile.userId],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  feedback: many(messageFeedback),
}));

export const messageFeedbackRelations = relations(messageFeedback, ({ one }) => ({
  message: one(messages, {
    fields: [messageFeedback.messageId],
    references: [messages.id],
  }),
}));

// Brand Monitor Analyses
export const brandAnalyses = pgTable('brand_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  companyName: text('company_name'),
  industry: text('industry'),
  analysisData: jsonb('analysis_data'), // Stores the full analysis results
  competitors: jsonb('competitors'), // Stores competitor data
  prompts: jsonb('prompts'), // Stores the prompts used
  creditsUsed: integer('credits_used').default(10),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// Source Tracker - Track which domains/pages cite the brand
export const sourceDomains = pgTable('source_domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandAnalysisId: uuid('brand_analysis_id').notNull().references(() => brandAnalyses.id, { onDelete: 'cascade' }),
  domain: text('domain').notNull(), // e.g., 'reddit.com'
  domainName: text('domain_name'), // e.g., 'Reddit'
  timesCited: integer('times_cited').default(0),
  shareOfCitations: integer('share_of_citations'), // Percentage (0-100)
  category: text('category'), // 'Industry & Network', 'Social', 'Competitor', etc.
  createdAt: timestamp('created_at').defaultNow(),
});

export const sourcePages = pgTable('source_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandAnalysisId: uuid('brand_analysis_id').notNull().references(() => brandAnalyses.id, { onDelete: 'cascade' }),
  domainId: uuid('domain_id').references(() => sourceDomains.id, { onDelete: 'cascade' }),
  url: text('url').notNull(), // Full URL
  title: text('title'), // Page title
  timesCited: integer('times_cited').default(0),
  shareOfCitations: integer('share_of_citations'), // Percentage (0-100)
  createdAt: timestamp('created_at').defaultNow(),
});

// Historical Tracking - Store snapshots of metrics over time
export const brandAnalysisSnapshots = pgTable('brand_analysis_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandAnalysisId: uuid('brand_analysis_id').notNull().references(() => brandAnalyses.id, { onDelete: 'cascade' }),
  visibilityScore: integer('visibility_score'), // 0-100
  sentimentScore: integer('sentiment_score'), // 0-100
  shareOfVoice: integer('share_of_voice'), // 0-100
  averagePosition: integer('average_position'),
  rank: integer('rank'), // 1, 2, 3, etc.
  snapshotDate: timestamp('snapshot_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const brandAnalysesRelations = relations(brandAnalyses, ({ one, many }) => ({
  userProfile: one(userProfile, {
    fields: [brandAnalyses.userId],
    references: [userProfile.userId],
  }),
  sourceDomains: many(sourceDomains),
  sourcePages: many(sourcePages),
  snapshots: many(brandAnalysisSnapshots),
}));

export const sourceDomainsRelations = relations(sourceDomains, ({ one, many }) => ({
  brandAnalysis: one(brandAnalyses, {
    fields: [sourceDomains.brandAnalysisId],
    references: [brandAnalyses.id],
  }),
  sourcePages: many(sourcePages),
}));

export const sourcePagesRelations = relations(sourcePages, ({ one }) => ({
  brandAnalysis: one(brandAnalyses, {
    fields: [sourcePages.brandAnalysisId],
    references: [brandAnalyses.id],
  }),
  domain: one(sourceDomains, {
    fields: [sourcePages.domainId],
    references: [sourceDomains.id],
  }),
}));

export const brandAnalysisSnapshotsRelations = relations(brandAnalysisSnapshots, ({ one }) => ({
  brandAnalysis: one(brandAnalyses, {
    fields: [brandAnalysisSnapshots.brandAnalysisId],
    references: [brandAnalyses.id],
  }),
}));

// Type exports for use in application
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type MessageFeedback = typeof messageFeedback.$inferSelect;
export type NewMessageFeedback = typeof messageFeedback.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
export type BrandAnalysis = typeof brandAnalyses.$inferSelect;
export type NewBrandAnalysis = typeof brandAnalyses.$inferInsert;
export type SourceDomain = typeof sourceDomains.$inferSelect;
export type NewSourceDomain = typeof sourceDomains.$inferInsert;
export type SourcePage = typeof sourcePages.$inferSelect;
export type NewSourcePage = typeof sourcePages.$inferInsert;
export type BrandAnalysisSnapshot = typeof brandAnalysisSnapshots.$inferSelect;
export type NewBrandAnalysisSnapshot = typeof brandAnalysisSnapshots.$inferInsert;