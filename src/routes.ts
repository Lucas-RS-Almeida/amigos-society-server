import { Router } from "express";

import AuthController from "./app/controllers/AuthController";
import PlayerController from "./app/controllers/PlayerController";
import TeamController from "./app/controllers/TeamController";

import auth from "./middlewares/auth";

const routes = Router();

// Routes to authentication
routes.post("/auth/log-in", AuthController.index as any);
routes.post("/auth/sign-up", AuthController.store as any);

// Routes to players
routes.get("/players/:matchDay", auth as any, PlayerController.index);
routes.get("/players/:matchDay/ip", PlayerController.verify);
routes.post("/players", PlayerController.store as any);

// Routes to teams
routes.get("/teams", TeamController.index);
routes.post("/teams", auth as any, TeamController.store as any);
routes.put("/teams/:id", auth as any, TeamController.update as any);
routes.delete("/teams/:id", auth as any, TeamController.delete);

export default routes;
