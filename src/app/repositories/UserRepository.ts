import { eq } from "drizzle-orm";

import { db } from "../../db";
import { usersTable } from "../../db/schema";

interface ICreateProps {
  name: string;
  password: string;
}

interface IInsertRandomTokenProps {
  tokenRandom: string;
  tokenRandomExpires: Date;
}

class UserRepository {
  async findByName(name: string) {
    const rows = await db.select()
      .from(usersTable)
      .where(eq(usersTable.name, name));

    return rows[0];
  }

  async create(body: ICreateProps) {
    const row: typeof usersTable.$inferInsert = body;

    await db.insert(usersTable).values(row);
  }

  async insertTokenRandom(id: string, body: IInsertRandomTokenProps) {
    await db
      .update(usersTable)
      .set(body)
      .where(eq(usersTable.id, id));
  }

  async delete(id: string) {
    await db.delete(usersTable).where(eq(usersTable.id, id));
  }
}

export default new UserRepository();
