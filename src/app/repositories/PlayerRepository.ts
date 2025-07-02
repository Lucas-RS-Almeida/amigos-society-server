import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import { playersTable } from "../../db/schema";

interface ICreateProps {
  name: string;
  playerType: "player" | "goalkeeper";
  matchDay: string;
  ipPlayer: string;
}

class PlayerRepository {
  async create(body: ICreateProps) {
    const values: typeof playersTable.$inferInsert = body;

    const response = await db.insert(playersTable).values(values).returning();

    return response;
  }

  async findByMatchDay(matchDay: string) {
    const rows = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.matchDay, matchDay));

    return rows;
  }

  async findByIpPlaler(ipPlayer: string, matchDay: string) {
    const rows = await db
      .select()
      .from(playersTable)
      .where(and(
        eq(playersTable.ipPlayer, ipPlayer),
        eq(playersTable.matchDay, matchDay)
      ));

    return rows[0];
  }

  async insertTeamIntoPlayer(teamId: string, playerId: string) {
    await db.update(playersTable).set({ teamId }).where(eq(playersTable.id, playerId));
  }

  async delete(id: string) {
    await db.delete(playersTable).where(eq(playersTable.id, id));
  }
}

export default new PlayerRepository();
