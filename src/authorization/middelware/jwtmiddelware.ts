import express from 'express';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET: string = process.env.JWT_SECRET_KEY as string;

const verify: RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, TOKEN_SECRET);
    // @ts-ignore
    req.body.id = decoded.id;
    next();
  } catch {
    res.status(401);
    res.json({ status: 'forbidden' });
  }
};
export default verify;
