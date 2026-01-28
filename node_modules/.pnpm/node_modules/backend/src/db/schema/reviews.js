import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { films } from "./films.js";

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    filmId: integer("film_id")
      .references(() => films.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueReview: unique().on(table.userId, table.filmId),
  })
);
