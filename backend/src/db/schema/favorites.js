import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { films } from "./films.js";

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  filmId: integer("film_id").notNull().references(() => films.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});
