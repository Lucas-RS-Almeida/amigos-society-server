import { Router } from "express";

import AuthController from "./app/controllers/AuthController";
import PlayerController from "./app/controllers/PlayerController";
import TeamController from "./app/controllers/TeamController";

import auth from "./middlewares/auth";
import checkUser from "./middlewares/checkUser";
import MatchContoller from "./app/controllers/MatchContoller";
import MatchPlayerController from "./app/controllers/MatchPlayerController";

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
routes.get("/players/:matchDay", auth as any, PlayerController.index);
routes.get("/players/:matchDay/ip", PlayerController.verify);
routes.post("/players", PlayerController.store as any);

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
routes.post(
  "/matches",
  auth as any,
  checkUser as any,
  MatchContoller.store as any,
);

// Routes to match player
routes.get("/match-player/:id", MatchPlayerController.index as any);
routes.post(
  "/match-player",
  auth as any,
  checkUser as any,
  MatchPlayerController.store as any,
);
routes.delete(
  "/match-player/:id",
  auth as any,
  checkUser as any,
  MatchPlayerController.delete as any,
);

export default routes;
