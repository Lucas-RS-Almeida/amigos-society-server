import { relations } from "drizzle-orm";
import {
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgTable,
  pgEnum,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  tokenRandom: text("token_random"),
  tokenRandomExpires: timestamp("token_random_expires"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const teamsTable = pgTable("teams", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const teamsTableRelations = relations(teamsTable, ({ many }) => ({
  players: many(playersTable),
}));

export const playerTypeEnum = pgEnum("players_type", ["player", "goalkeeper"]);

export const playersTable = pgTable("players", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  playerType: playerTypeEnum("player_type").notNull(),
  teamId: uuid("team_id").references(() => teamsTable.id),
  matchDay: text("matchDay").notNull(),
  ipPlayer: text("ip_player").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const playersTableRelations = relations(playersTable, ({ one }) => ({
  team: one(teamsTable, {
    fields: [playersTable.teamId],
    references: [teamsTable.id],
  }),
}));

export const matchesTable = pgTable("matches", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  homeTeamId: uuid("home_team_id").notNull().references(() => teamsTable.id),
  awayTeamId: uuid("away_team_id").notNull().references(() => teamsTable.id),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  matchDay: text("matchDay").notNull(),
  inProgress: boolean("in_progress").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const matchesTableRelations = relations(matchesTable, ({ one }) => ({
  homeTeam: one(teamsTable, {
    fields: [matchesTable.homeTeamId],
    references: [teamsTable.id],
  }),
  awayTeam: one(teamsTable, {
    fields: [matchesTable.awayTeamId],
    references: [teamsTable.id],
  }),
}));

export const matchPlayerTable = pgTable("match_player", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  matchId: uuid("match_id").notNull().references(() => matchesTable.id),
  playerId: uuid("player_id").notNull().references(() => playersTable.id),
  teamId: uuid("team_id").notNull().references(() => teamsTable.id),
  goals: integer("goals").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCard: boolean("red_card").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const matchPlayerRelations = relations(matchPlayerTable, ({ one }) => ({
  match: one(matchesTable, {
    fields: [matchPlayerTable.matchId],
    references: [matchesTable.id],
  }),
  player: one(playersTable, {
    fields: [matchPlayerTable.playerId],
    references: [playersTable.id],
  }),
  team: one(teamsTable, {
    fields: [matchPlayerTable.teamId],
    references: [teamsTable.id],
  }),
}));
