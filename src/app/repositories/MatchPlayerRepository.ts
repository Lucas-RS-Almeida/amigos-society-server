import { eq, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "../../db";
import { matchesTable, matchPlayerTable, playersTable, teamsTable } from "../../db/schema";

interface ICreateProps {
  matchId: string;
  playerId: string;
  teamId: string;
  goals: number;
  yellowCards: number;
  redCard: boolean;
}

interface IUpdateProps {
  goals: number;
  yellowCards: number;
  redCard: boolean;
}

class MatchPlayerRepository {
  async find(matchId: string) {
    const match = alias(matchesTable, "match");
    const player = alias(playersTable, "player");
    const team = alias(teamsTable, "team");

    const rows = await db
      .select()
      .from(matchPlayerTable)
      .innerJoin(match, eq(matchPlayerTable.matchId, match.id))
      .innerJoin(player, eq(matchPlayerTable.playerId, player.id))
      .innerJoin(team, eq(matchPlayerTable.teamId, team.id))
      .where(eq(matchPlayerTable.matchId, matchId));

    return rows;
  }

  async findByMatchAndPlayer(matchId: string, playerId: string) {
    const row = await db
      .select()
      .from(matchPlayerTable)
      .where(and(
        eq(matchPlayerTable.matchId, matchId),
        eq(matchPlayerTable.playerId, playerId),
      ));

    return row[0];
  }

  async create(body: ICreateProps) {
    const values: typeof matchPlayerTable.$inferInsert = body;

    const row = await db.insert(matchPlayerTable).values(values).returning();

    return row[0];
  }

  async update(id: string, body: IUpdateProps) {
    const row = await db
      .update(matchPlayerTable)
      .set(body)
      .where(eq(matchPlayerTable.id, id))
      .returning();

    return row[0];
  }

  async delete(id: string) {
    await db.delete(matchPlayerTable).where(eq(matchPlayerTable.id, id));
  }
}

export default new MatchPlayerRepository();
