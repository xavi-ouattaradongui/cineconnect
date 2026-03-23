ALTER TABLE "user_lists" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_lists" CASCADE;--> statement-breakpoint
ALTER TABLE "films" ALTER COLUMN "poster" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "films" DROP COLUMN "genre";--> statement-breakpoint
ALTER TABLE "films" DROP COLUMN "director";--> statement-breakpoint
ALTER TABLE "films" DROP COLUMN "plot";