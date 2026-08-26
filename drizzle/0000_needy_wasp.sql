CREATE TYPE "public"."application_status" AS ENUM('pending', 'approved', 'rejected', 'closed');--> statement-breakpoint
CREATE TYPE "public"."message_sender" AS ENUM('client', 'admin');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "consultation_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"email" varchar(320) NOT NULL,
	"consultation_type" varchar(120) NOT NULL,
	"inquiry_summary" text NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"consent_version" varchar(40) NOT NULL,
	"care_scope_accepted_at" timestamp NOT NULL,
	"privacy_accepted_at" timestamp NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"decided_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultation_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"sender" "message_sender" NOT NULL,
	"content" varchar(1600) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "consultation_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"approved_at" timestamp DEFAULT now() NOT NULL,
	"notification_status" "notification_status" DEFAULT 'pending' NOT NULL,
	"notification_error" varchar(500),
	CONSTRAINT "consultation_sessions_application_id_unique" UNIQUE("application_id"),
	CONSTRAINT "consultation_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "consultation_messages" ADD CONSTRAINT "consultation_messages_session_id_consultation_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."consultation_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_application_id_consultation_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."consultation_applications"("id") ON DELETE cascade ON UPDATE no action;