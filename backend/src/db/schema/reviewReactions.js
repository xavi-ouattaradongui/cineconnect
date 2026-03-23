import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { reviews } from "./reviews.js";

export const reviewReactions = pgTable(
  "review_reactions",
  {
    id: serial("id").primaryKey(),
    reviewId: integer("review_id")
      .references(() => reviews.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    type: varchar("type", { length: 20 }).notNull(), // 'like' ou 'dislike'
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueReaction: unique().on(table.reviewId, table.userId, table.type),
  })
);
