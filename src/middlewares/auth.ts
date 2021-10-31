import { NextFunction, Request, Response } from "express";
import { AppError } from "@errors/AppError";
import jwt from 'jsonwebtoken';

const handleAuth = async (req: Request, res: Response, next: NextFunction) => {
  const headerAuth = req.headers.authorization;

  if (!headerAuth) 
    throw new AppError('Token não informado', 401);

  const [ bearer, token ] = headerAuth.split(' ');

  if (!bearer || !token) 
    throw new AppError('Token inválido', 401);

  const startsWithBearer = /^Bearer$/i;

  if (!startsWithBearer.test(bearer))
    throw new AppError('Token inválido', 401)

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) throw new AppError('Token inválido', 401);
    req.userId = decoded.id;
    return next();
  });

}

export { handleAuth };