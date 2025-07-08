import { Request, Response } from "express";

import StatisticPlayerRepository from "../repositories/StatisticPlayerRepository";
import MatchRepository from "../repositories/MatchRepository";
import TeamRepository from "../repositories/TeamRepository";
import PlayerRepository from "../repositories/PlayerRepository";

class StatisticPlayerController {
  async index(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const matchPlayer = await StatisticPlayerRepository.find(id);
      if (!matchPlayer) {
        return res.status(404).json({
          error: "Não há estatíscas para essa partida.",
        });
      }

      res.json(matchPlayer);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao listar estatíscas da partida, tente novamente",
      });
    }
  }

  async store(req: Request, res: Response) {
    const {
      matchId,
      playerId,
      teamId,
      teamType,
      goals,
      yellowCards,
      redCard,
    } = req.body;

    try {
      const match = await MatchRepository.findById(matchId);
      if (!match) {
        return res.status(404).json({
          error: "Partida não encontrada.",
        });
      }

      const team = await TeamRepository.findById(teamId);
      if (!team) {
        return res.status(404).json({
          error: "Time não encontrado.",
        });
      }

      const player = await PlayerRepository.findById(playerId);
      if (!player) {
        return res.status(404).json({
          error: "Jogador/goleiro não encontrado.",
        });
      }

      if (goals !== 0) {
        await MatchRepository.insertScore(matchId, teamType);
      }

      const newMatchPlayer = await StatisticPlayerRepository.create({
        matchId,
        playerId,
        teamId,
        teamType,
        goals,
        yellowCards,
        redCard,
      });

      res.json(newMatchPlayer);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao criar estatísca da partida, tente novamente",
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await StatisticPlayerRepository.delete(id);

      res.sendStatus(200);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao listar estatíscas da partida, tente novamente",
      });
    }
  }
}

export default new StatisticPlayerController();
