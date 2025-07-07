import { Request, Response } from "express";

import MatchPlayerRepository from "../repositories/MatchPlayerRepository";
import MatchRepository from "../repositories/MatchRepository";

class MatchPlayerController {
  async index(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const matchPlayer = await MatchPlayerRepository.find(id);
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

      const matchPlayerExists = await MatchPlayerRepository
        .findByMatchAndPlayer(matchId, playerId);
      if (matchPlayerExists) {
        const matchPlayerUpdated = await MatchPlayerRepository
          .update(matchPlayerExists.id, { goals, yellowCards, redCard });

        res.json(matchPlayerUpdated);

        return;
      }

      const newMatchPlayer = await MatchPlayerRepository.create({
        matchId, playerId, teamId, goals, yellowCards, redCard,
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
      await MatchPlayerRepository.delete(id);

      res.sendStatus(200);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao listar estatíscas da partida, tente novamente",
      });
    }
  }
}

export default new MatchPlayerController();
