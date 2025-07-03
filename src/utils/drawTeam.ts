import { eq } from "drizzle-orm";

import { db } from "../db";
import { teamsTable, playersTable } from "../db/schema";

interface ICountsProps {
  teamId: string;
  total: number;
  withVacancy: boolean;
}

export async function drawTeam(playerType: "player" | "goalkeeper") {
  const teams = await db.select().from(teamsTable);
  const players = await db.select().from(playersTable);

  const matchDay = new Date().toISOString().split("T")[0];

  const counts: ICountsProps[] = teams.map((team) => {
    const allPlayersTeam = players
      .filter((p) => (p.teamId === team.id) && (p.matchDay === matchDay));
    const totalGoalkeepers = allPlayersTeam
      .filter((p) => p.playerType === "goalkeeper").length;
    const totalPlayers = allPlayersTeam
      .filter((p) => p.playerType === "player").length;

    return {
      teamId: team.id,
      total: playerType === "goalkeeper" ? totalGoalkeepers : totalPlayers,
      withVacancy: playerType === "goalkeeper"
        ? totalGoalkeepers < 1
        : totalPlayers < 5,
    }
  });

  const withVacancy = counts.filter((w) => w.withVacancy);

  if (withVacancy.length === 0) {
    return null;
  }

  withVacancy.sort((a, b) => a.total - b.total);

  return withVacancy[0].teamId;
}
