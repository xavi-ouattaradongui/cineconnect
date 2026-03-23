ALTER TABLE "films" ALTER COLUMN "poster" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "films" ADD COLUMN "genre" varchar(100);--> statement-breakpoint
ALTER TABLE "films" ADD COLUMN "director" varchar(255);--> statement-breakpoint
ALTER TABLE "films" ADD COLUMN "plot" text;