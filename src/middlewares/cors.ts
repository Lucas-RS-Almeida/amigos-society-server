import { Request, Response, NextFunction } from "express";

export function cors(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", String(process.env.CLIENT_URL));
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Max-Age", 20);

  next();
}
