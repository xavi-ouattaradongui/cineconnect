import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { films } from "./films.js";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 100 }),
  avatar: varchar("avatar", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userChatSeen = pgTable("user_chat_seen", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  filmId: integer("film_id").references(() => films.id).notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
});
