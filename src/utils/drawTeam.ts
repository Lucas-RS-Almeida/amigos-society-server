import { eq } from "drizzle-orm";

import { db } from "../db";
import { teamsTable, playersTable } from "../db/schema";

interface ICountsProps {
  teamId: string;
  total: number;
}

export async function drawTeam(playerType: "player" | "goalkeeper") {
  const counts: ICountsProps[] = [];

  const teams = await db.select().from(teamsTable);

  for (const team of teams) {
    const teamPlayers = await db.select()
      .from(playersTable)
      .where(eq(playersTable.teamId, team.id));

    const totalGoalkeepers = teamPlayers.filter((p) => p.playerType === "goalkeeper").length;
    const totalPlayers = teamPlayers.filter((p) => p.playerType === "player").length;

    if (playerType === "goalkeeper" && totalGoalkeepers < 1) {
      counts.push({ teamId: team.id, total: totalGoalkeepers });
    }

    if (playerType === "player" && totalPlayers < 5) {
      counts.push({ teamId: team.id, total: totalPlayers });
    }

    if (counts.length === 0) {
      return null;
    }

    counts.sort((a, b) => a.total - b.total);

    return counts[0].teamId;
  }
}
