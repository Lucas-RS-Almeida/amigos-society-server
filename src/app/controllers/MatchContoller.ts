import { Request, Response } from "express";

import MatchRepository from "../repositories/MatchRepository";

class MatchContoller {
  async index(req: Request, res: Response) {
    try {
      const now = new Date().toISOString().split("T")[0];

      const matches = await MatchRepository.find(now);

      res.json(matches);
    } catch (error: any) {
      console.log(error);

      res.status(500).json({
        error: "Houve um erro no servidor ao carregar partidas, tente novamente",
      });
    }
  }

  async store(req: Request, res: Response) {
    const { homeTeamId, awayTeamId } = req.body;

    if (!homeTeamId || !awayTeamId) {
      return res.status(400).json({
        error: "Todos os campos são obrigatóerios.",
      });
    }

    try {
      const now = new Date().toISOString().split("T")[0];

      const newMatch = await MatchRepository
        .create({ homeTeamId, awayTeamId, matchDay: now });

      res.status(201).json(newMatch);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao criar partida, tente novamente",
      });
    }
  }
}

export default new MatchContoller();
