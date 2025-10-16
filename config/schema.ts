import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ───────────────────────────────
// USERS TABLE
// ───────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 128 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),  
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ───────────────────────────────
// SERVERS TABLE
// ───────────────────────────────
export const servers = pgTable("servers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  inviteCode: varchar("invite_code", { length: 10 }).unique(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ───────────────────────────────
// MEMBERS TABLE
// ───────────────────────────────
export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: varchar("role", { length: 20 }).default("GUEST"), // OWNER, ADMIN, GUEST
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  serverId: uuid("server_id")
    .notNull()
    .references(() => servers.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// ───────────────────────────────
// CHANNELS TABLE
// ───────────────────────────────
export const channels = pgTable("channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  type: varchar("type", { length: 10 }).default("TEXT"), // TEXT or VOICE
  serverId: uuid("server_id")
    .notNull()
    .references(() => servers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ───────────────────────────────
// FRIENDS TABLE
// ───────────────────────────────
export const friends = pgTable("friends", {
  id: uuid("id").defaultRandom().primaryKey(),
  requesterId: uuid("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  addresseeId: uuid("addressee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).default("PENDING"), // PENDING | ACCEPTED | BLOCKED
  createdAt: timestamp("created_at").defaultNow(),
});

// ───────────────────────────────
// MESSAGES TABLE
// ───────────────────────────────
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),

  // For server messages
  channelId: uuid("channel_id").references(() => channels.id, { onDelete: "cascade" }),

  // For direct messages (DMs)
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: uuid("receiver_id").references(() => users.id, { onDelete: "cascade" }),

  type: varchar("type", { length: 10 }).default("CHANNEL"), // CHANNEL or DIRECT

  createdAt: timestamp("created_at").defaultNow(),
});

// ───────────────────────────────
// RELATIONS (Drizzle Relations)
// ───────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  servers: many(servers),
  messages: many(messages),
  members: many(members),
  friendsAsRequester: many(friends, { relationName: "requester" }),
  friendsAsAddressee: many(friends, { relationName: "addressee" }),
}));

export const serversRelations = relations(servers, ({ one, many }) => ({
  owner: one(users, {
    fields: [servers.ownerId],
    references: [users.id],
  }),
  members: many(members),
  channels: many(channels),
}));

export const channelsRelations = relations(channels, ({ one, many }) => ({
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
  messages: many(messages),
}));

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  server: one(servers, {
    fields: [members.serverId],
    references: [servers.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
}));

export const friendsRelations = relations(friends, ({ one }) => ({
  requester: one(users, {
    fields: [friends.requesterId],
    references: [users.id],
  }),
  addressee: one(users, {
    fields: [friends.addresseeId],
    references: [users.id],
  }),
}));
