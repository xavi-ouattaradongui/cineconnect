DO $$
BEGIN
	IF to_regclass('public.user_lists') IS NOT NULL THEN
		ALTER TABLE "user_lists" DISABLE ROW LEVEL SECURITY;
		DROP TABLE "user_lists" CASCADE;
	END IF;
END $$;--> statement-breakpoint
ALTER TABLE "films" ALTER COLUMN "poster" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "films" DROP COLUMN IF EXISTS "genre";--> statement-breakpoint
ALTER TABLE "films" DROP COLUMN IF EXISTS "director";--> statement-breakpoint
ALTER TABLE "films" DROP COLUMN IF EXISTS "plot";