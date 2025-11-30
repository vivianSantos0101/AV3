import { Request, Response, NextFunction } from "express";
import { z, ZodObject } from "zod";

export const validateSchema = (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {

    // safeParse não joga erro, ele retorna um objeto com sucesso true/false
    const resultBody = schema.safeParse(req.body);

    if (!resultBody.success) {
      // Retorna 400 (Bad Request) com os detalhes do erro
      return res.status(400).json({
        msg: "Dados inválidos",
        errors: resultBody.error.issues
      });
    }

    req.body = resultBody.data

    next();
  };