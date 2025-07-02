import { Request, Response } from "express";

import TeamRepository from "../repositories/TeamRepository";

class TeamController {
  async index(_: Request, res: Response) {
    try {
      const teams = await TeamRepository.find();

      res.json(teams);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao listar times, tente novamente.",
      });
    }
  }

  async store(req: Request, res: Response) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Nome é obrigatórios.",
      });
    }

    try {
      await TeamRepository.create(name);

      res.sendStatus(201);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao criar o time, tente novamente.",
      });
    }
  }

  async update(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({
        error: "Nome é obrigatórios.",
      });
    }

    try {
      await TeamRepository.update(id, name);

      res.sendStatus(200);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao editar o time, tente novamente.",
      });
    }
  }
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await TeamRepository.delete(id);

      res.sendStatus(200);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor deletar o time, tente novamente.",
      });
    }
  }
}

export default new TeamController();
