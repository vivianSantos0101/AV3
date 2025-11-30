import type { NextFunction, Request, Response } from "express";
import { NivelAcesso } from "../generated/prisma/enums.js";
import jwt from 'jsonwebtoken';
import { env } from "../env.js";

const JWT_SECRET = env.JWT_SECRET as string;

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const cookieToken = req.cookies.auth;

    let token: string | undefined;

    if (cookieToken) {
      token = cookieToken;
    } else if (header?.startsWith("Bearer ")) {
      token = header.replace("Bearer ", "");
    }

    if (!token) {
      console.warn(
        `[AUTH 401] Token não fornecido — ${req.method} ${req.originalUrl} | IP: ${req.ip}`
      );
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      usuario: string;
      nivelAcesso: NivelAcesso;
    };

    req.user = decoded;
    next();
  } catch (err) {
    console.warn(
      `[AUTH 401] Token inválido ou expirado — ${req.method} ${req.originalUrl} | IP: ${req.ip}`
    );
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

export const authorize = (requiredLevel: NivelAcesso) => 
  (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, (err?: any) => {
      if (err) {
        console.warn(`[AUTH 401] Falhou autenticação em ${req.method} ${req.originalUrl}`);
        return; // requireAuth já tratou
      }

      const user = req.user!;
      if (user.nivelAcesso > requiredLevel) {
        console.warn(
          `[AUTH 403] Usuário "${user.usuario}" tentou acessar ${req.method} ${req.originalUrl} sem permissão. Nivel=${user.nivelAcesso}, Requerido=${requiredLevel}`
        );
        return res.status(403).json({ error: "Sem permissão" });
      }

      next();
    });
  };
