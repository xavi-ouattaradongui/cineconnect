import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  imdbId: varchar("imdb_id", { length: 20 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  poster: varchar("poster", { length: 255 }),
  year: integer("year"),
});
