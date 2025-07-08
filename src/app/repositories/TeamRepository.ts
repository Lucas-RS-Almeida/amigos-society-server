import { asc, eq } from "drizzle-orm";

import { db } from "../../db";
import { teamsTable } from "../../db/schema";

class TeamRepository {
  async create(name: string) {
    const values: typeof teamsTable.$inferInsert = { name };

    await db.insert(teamsTable).values(values).returning();
  }

  async find() {
    const rows = await db.select().from(teamsTable).orderBy(asc(teamsTable.name));

    return rows;
  }

  async findById(id: string) {
      const row = await db
        .select()
        .from(teamsTable)
        .where(eq(teamsTable.id, id));

      return row[0];
    }

  async update(id: string, name: string) {
    await db.update(teamsTable).set({ name }).where(eq(teamsTable.id, id));
  }

  async delete(id: string) {
    await db.delete(teamsTable).where(eq(teamsTable.id, id));
  }
}

export default new TeamRepository();
