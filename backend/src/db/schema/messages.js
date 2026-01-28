import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { films } from "./films.js";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  filmId: integer("film_id")
    .references(() => films.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
