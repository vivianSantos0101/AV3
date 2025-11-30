import { Request, Response } from 'express';
import * as colaboradorService from './colaboradores.service';

export const getColaboradores = async (req: Request, res: Response) => {
  try {
    const colaboradores = await colaboradorService.listarColaboradores();
    res.json(colaboradores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
