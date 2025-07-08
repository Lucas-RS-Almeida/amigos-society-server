import PlayerRepository from "../app/repositories/PlayerRepository";
import TeamRepository from "../app/repositories/TeamRepository";

interface ICountsProps {
  teamId: string;
  total: number;
  withVacancy: boolean;
}

function suffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export async function drawTeam() {
  const now = new Date().toISOString().split("T")[0];

  const playersToday = await PlayerRepository.findByMatchDay(now);

  const players = playersToday
    .filter((pt) => pt.playerType === "player");
  const gooalKeepers = playersToday
    .filter((pt) => pt.playerType === "goalkeeper");

  const drawPlayers = suffleArray(players);
  const drawGoalkeepers = suffleArray(gooalKeepers);

  const teams = await TeamRepository.find();

  const teamPlayers = [];

  for (let i = 0; i < 5; i++) {
    teamPlayers.push(drawPlayers.slice(i * 5, i * 5 + 5));
  }

  for (let i = 0; i < 5; i++) {
    const teamId = teams[i].id;
    const teamPlayersArr = teamPlayers[i];
    const goalkeeper = drawGoalkeepers[i];

    teamPlayersArr.map(async (tp) => {
      await PlayerRepository.insertTeam(tp.id, teamId);
    });

    await PlayerRepository.insertTeam(goalkeeper.id, teamId);
  }
}
