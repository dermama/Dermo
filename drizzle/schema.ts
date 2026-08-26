import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const applicationStatus = pgEnum("application_status", ["pending", "approved", "rejected", "closed"]);
export const notificationStatus = pgEnum("notification_status", ["pending", "sent", "failed"]);
export const messageSender = pgEnum("message_sender", ["client", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const consultationApplications = pgTable("consultation_applications", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  consultationType: varchar("consultation_type", { length: 120 }).notNull(),
  inquirySummary: text("inquiry_summary").notNull(),
  status: applicationStatus("status").default("pending").notNull(),
  consentVersion: varchar("consent_version", { length: 40 }).notNull(),
  careScopeAcceptedAt: timestamp("care_scope_accepted_at").notNull(),
  privacyAcceptedAt: timestamp("privacy_accepted_at").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  decidedAt: timestamp("decided_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consultationSessions = pgTable("consultation_sessions", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().unique().references(() => consultationApplications.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  approvedAt: timestamp("approved_at").defaultNow().notNull(),
  notificationStatus: notificationStatus("notification_status").default("pending").notNull(),
  notificationError: varchar("notification_error", { length: 500 }),
});

export const consultationMessages = pgTable("consultation_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => consultationSessions.id, { onDelete: "cascade" }),
  sender: messageSender("sender").notNull(),
  content: varchar("content", { length: 1600 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ConsultationApplication = typeof consultationApplications.$inferSelect;
export type ConsultationSession = typeof consultationSessions.$inferSelect;
export type ConsultationMessage = typeof consultationMessages.$inferSelect;
