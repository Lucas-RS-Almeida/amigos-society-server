import { eq, desc, sql } from "drizzle-orm";

import { db } from "../../db";
import { matchesTable, teamsTable } from "../../db/schema";
import { alias } from "drizzle-orm/pg-core";

interface ICreateProps {
  homeTeamId: string;
  awayTeamId: string;
  matchDay: string;
}

class MatchRepository {
  async find(matchDay: string) {
    const homeTeam = alias(teamsTable, "home_team");
    const awayTeam = alias(teamsTable, "away_team");

    const rows = await db
      .select()
      .from(matchesTable)
      .innerJoin(homeTeam, eq(matchesTable.homeTeamId, homeTeam.id))
      .innerJoin(awayTeam, eq(matchesTable.awayTeamId, awayTeam.id))
      .where(eq(matchesTable.matchDay, matchDay))
      .orderBy(desc(matchesTable.createdAt));

    return rows;
  }

  async findById(id: string) {
    const row = await db
      .select()
      .from(matchesTable)
      .where(eq(matchesTable.id, id));

    return row[0];
  }

  async create(body: ICreateProps) {
    const values: typeof matchesTable.$inferInsert = body;

    const row = await db.insert(matchesTable).values(values).returning();

    return row[0];
  }

  async insertScore(id: string, team: "home" | "away") {
    await db
      .update(matchesTable)
      .set(team === "home" ? { homeScore: sql`${matchesTable.homeScore} + 1` } : { awayScore: sql`${matchesTable.awayScore} + 1` })
      .where(eq(matchesTable.id, id));
  }

  async endGame(id: string) {
    await db
      .update(matchesTable)
      .set({ inProgress: false })
      .where(eq(matchesTable.id, id));
  }
}

export default new MatchRepository();
