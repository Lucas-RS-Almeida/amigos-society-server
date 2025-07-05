import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { usersTable } from "../db/schema";

export default async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = await db.select().from(usersTable).where(
    eq(usersTable.tokenRandom, req.tokenRandom)
  );

  if (!user[0]) {
    return res.status(501).json({
      error: "Seu token mudou, faça login novamente."
    });
  }

  const now = new Date();

  if (user[0].tokenRandomExpires && user[0].tokenRandomExpires < now) {
    return res.status(501).json({
      error: "Seu token expirou, faça login novamente."
    });
  }

  next();
}
