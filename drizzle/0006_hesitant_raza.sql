ALTER TABLE "verification_token" RENAME TO "verificationToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "provider_account_id" TO "providerAccountId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "refresh_token" TO "refreshToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "access_token" TO "accessToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "expires_at" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "token_type" TO "tokenType";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "id_token" TO "idToken";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "session_state" TO "sessionState";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "session_token" TO "sessionToken";--> statement-breakpoint
ALTER TABLE "url" RENAME COLUMN "original_url" TO "originalUrl";--> statement-breakpoint
ALTER TABLE "url" RENAME COLUMN "short_code" TO "shortCode";--> statement-breakpoint
ALTER TABLE "url" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "url" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "url" RENAME COLUMN "flag_reason" TO "flagReason";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "url" DROP CONSTRAINT "url_short_code_unique";--> statement-breakpoint
ALTER TABLE "url" ADD CONSTRAINT "url_shortCode_unique" UNIQUE("shortCode");