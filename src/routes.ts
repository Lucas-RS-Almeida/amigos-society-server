import { Router } from "express";

import AuthController from "./app/controllers/AuthController";
import PlayerController from "./app/controllers/PlayerController";
import TeamController from "./app/controllers/TeamController";

import auth from "./middlewares/auth";
import checkUser from "./middlewares/checkUser";
import MatchContoller from "./app/controllers/MatchContoller";
import StatisticPlayerController from "./app/controllers/StatisticPlayerController";

const routes = Router();

// Routes to authentication
routes.get(
  "/auth/check-user",
  auth as any,
  checkUser as any,
  AuthController.check,
);
routes.post("/auth/log-in", AuthController.index as any);
routes.post("/auth/sign-up", AuthController.store as any);

// Routes to players
routes.get("/players/:matchDay", PlayerController.index);
routes.get("/players/:matchDay/ip", PlayerController.verify);
routes.post("/players", PlayerController.store as any);
routes.put(
  "/players/draw-team",
  auth as any,
  checkUser as any,
  PlayerController.drawTeam,
);

// Routes to teams
routes.get("/teams", TeamController.index);
routes.post(
  "/teams",
  auth as any,
  checkUser as any,
  TeamController.store as any,
);
routes.put(
  "/teams/:id",
  auth as any,
  checkUser as any,
  TeamController.update as any,
);
routes.delete(
  "/teams/:id",
  auth as any,
  checkUser as any,
  TeamController.delete,
);

// Routes to matches
routes.get("/matches", MatchContoller.index);
routes.put(
  "/matches/:id/end-game",
  auth as any,
  checkUser as any,
  MatchContoller.endGame as any,
);
routes.post(
  "/matches",
  auth as any,
  checkUser as any,
  MatchContoller.store as any,
);

// Routes to statistic player
routes.get("/statistic-player/:id", StatisticPlayerController.index as any);
routes.post(
  "/statistic-player",
  auth as any,
  checkUser as any,
  StatisticPlayerController.store as any,
);
routes.delete(
  "/statistic-player/:id",
  auth as any,
  checkUser as any,
  StatisticPlayerController.delete as any,
);

export default routes;
