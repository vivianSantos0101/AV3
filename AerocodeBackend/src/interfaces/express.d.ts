import { NivelAcesso } from "../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        usuario: string;
        nivelAcesso: NivelAcesso;
      };
    }
  }
}

export {};
