import { Request, Response } from "express";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import UserRepository from "../repositories/UserRepository";

class AuthController {
  async index(req: Request, res: Response) {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios.",
      });
    }

    try {
      const user = await UserRepository.findByName(name);
      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado.",
        });
      }

      if (!await argon2.verify(user.password, password)) {
        return res.status(400).json({
          error: "Senha incorreta.",
        });
      }

      const tokenRandom = crypto.randomBytes(Number(process.env.CRYPTO_RB))
        .toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 6);

      await UserRepository.insertTokenRandom(user.id, {
        tokenRandom,
        tokenRandomExpires: now,
      });

      const token = jwt.sign({ tokenRandom }, String(process.env.JWT_SECRET));

      res.json({
        user: {
          username: user.name,
        },
        token,
      });
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao entrar, tente novamente.",
      });
    }
  }

  async check(_: Request, res: Response) {
    res.sendStatus(200);
  }

  async store(req: Request, res: Response) {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Insira uma senha mais forte.",
      });
    }

    try {
      const nameIsAlreadyInUse = await UserRepository.findByName(name);
      if (nameIsAlreadyInUse) {
        return res.status(400).json({
          error: "Esse nome já está em uso.",
        });
      }

      const passwordHashed = await argon2.hash(password);

      await UserRepository.create({
        name, password: passwordHashed,
      });

      res.sendStatus(201);
    } catch {
      res.status(500).json({
        error: "Houve um erro no servidor ao criat conta, tente novamente.",
      });
    }
  }
}

export default new AuthController();
