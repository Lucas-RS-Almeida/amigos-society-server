import { Request, Response } from "express";

import PlayerRepository from "../repositories/PlayerRepository";
import { drawTeam } from "../../utils/drawTeam";

class PlayerController {
  async index(req: Request, res: Response) {
    const { matchDay } = req.params;

    try {
      const players = await PlayerRepository.findByMatchDay(matchDay);

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
}

export default new PlayerController();
