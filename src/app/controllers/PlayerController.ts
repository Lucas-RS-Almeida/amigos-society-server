import { Request, Response } from "express";

import PlayerRepository from "../repositories/PlayerRepository";
import { drawTeam } from "../../utils/drawTeam";

class PlayerController {
  async index(req: Request, res: Response) {
    const { matchDay } = req.params;

    try {
      const players = await PlayerRepository.findByMatchDayWithTeam(matchDay);

      res.json(players);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao listar jogadores, tente novamente.",
      });
    }
  }

  async verify(req: Request, res: Response) {
    const { matchDay } = req.params;
    const ipPlayer = req.ip;

    try {
      const playerRegistred = await PlayerRepository.findByIpPlaler(String(ipPlayer), matchDay);

      res.json({
        registred: playerRegistred ? true : false,
      });
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao buscar jogador, tente novamente.",
      });
    }
  }

  async store(req: Request, res: Response) {
    const { name, playerType } = req.body;
    const ipPlayer = req.ip;

    if (!name || !playerType) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios.",
      });
    }

    try {
      const now = new Date().toISOString().split("T")[0];

      // const playerRegistered = await PlayerRepository
      //   .findByIpPlaler(String(ipPlayer), now);
      // if (playerRegistered) {
      //   return res.status(400).json({
      //     error: "Voce já se cadastrou.",
      //   });
      // }

      const players = await PlayerRepository.findByMatchDay(now);

      const playersAmount = players
        .filter((p) => (p.playerType === "player")).length;
      const goalkeepersAmount = players
        .filter((p) => (p.playerType === "goalkeeper")).length;

      if ((playerType === "player") && (playersAmount >= 25)) {
        return res.status(400).json({
          error: "Todas as vagas para jogador foram preenchidas.",
        });
      }

      if ((playerType === "goalkeeper") && (goalkeepersAmount >= 5)) {
        return res.status(400).json({
          error: "Todas as vagas para goleiro foram preenchidas.",
        });
      }

      const newPlayer = await PlayerRepository.create({
        name,
        playerType,
        matchDay: now,
        ipPlayer: String(ipPlayer),
      });

      res.status(201).json(newPlayer);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao cadastrar, tente novamente.",
      });
    }
  }

  async drawTeam(_: Request, res: Response) {
    try {
      await drawTeam();

      res.sendStatus(200);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao tentar sortear times, tente novamente",
      });
    }
  }
}

export default new PlayerController();
