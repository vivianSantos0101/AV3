import { Request, Response } from "express";
import * as service from "./relatorios.service";
import z from "zod";

export const getRelatorio = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id);
    const relatorio = await service.gerarRelatorioService(parsedID);

    if (!relatorio) {
      return res.status(404).json({ error: "Projeto/Aeronave não encontrada." });
    }

    return res.json(relatorio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao gerar relatório." });
  }
};
