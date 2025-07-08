import { eq, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "../../db";
import { matchesTable, statisticsPlayerTable, playersTable, teamsTable } from "../../db/schema";

interface ICreateProps {
  matchId: string;
  playerId: string;
  teamId: string;
  teamType: "home" | "away";
  goals: number;
  yellowCards: number;
  redCard: boolean;
}

interface IUpdateProps {
  goals: number;
  yellowCards: number;
  redCard: boolean;
}

class StatisticPlayerRepository {
  async find(matchId: string) {
    const match = alias(matchesTable, "match");
    const player = alias(playersTable, "player");
    const team = alias(teamsTable, "team");

    const rows = await db
      .select()
      .from(statisticsPlayerTable)
      .innerJoin(match, eq(statisticsPlayerTable.matchId, match.id))
      .innerJoin(player, eq(statisticsPlayerTable.playerId, player.id))
      .innerJoin(team, eq(statisticsPlayerTable.teamId, team.id))
      .where(eq(statisticsPlayerTable.matchId, matchId));

    return rows;
  }

  async findByMatchAndPlayer(matchId: string, playerId: string) {
    const row = await db
      .select()
      .from(statisticsPlayerTable)
      .where(and(
        eq(statisticsPlayerTable.matchId, matchId),
        eq(statisticsPlayerTable.playerId, playerId),
      ));

    return row[0];
  }

  async create(body: ICreateProps) {
    const values: typeof statisticsPlayerTable.$inferInsert = body;

    const row = await db.insert(statisticsPlayerTable).values(values).returning();

    return row[0];
  }

  async update(id: string, body: IUpdateProps) {
    const row = await db
      .update(statisticsPlayerTable)
      .set(body)
      .where(eq(statisticsPlayerTable.id, id))
      .returning();

    return row[0];
  }

  async delete(id: string) {
    await db.delete(statisticsPlayerTable).where(eq(statisticsPlayerTable.id, id));
  }
}

export default new StatisticPlayerRepository();
