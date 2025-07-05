import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import "dotenv/config";

interface IEncodedProps {
  tokenRandom: string;
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(501).json({ error: 'No token provided' });
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2) {
    return res.status(501).json({ error: 'Token malformatted' });
  }

  const [schema, token] = parts;
  if (!/^Bearer$/i.test(schema)) {
    return res.status(501).json({ error: 'Token error' });
  }

  jwt.verify(token, String(process.env.JWT_SECRET), (error, encoded) => {
    if (error) {
      return res.status(501).json({ error: 'Invalid token' });
    }

    const { tokenRandom } = encoded as IEncodedProps;

    req.tokenRandom = tokenRandom;

    next();
  });
}
