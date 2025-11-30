import { Request, Response } from 'express';
import * as service from './aeronave.service';
import z from 'zod';

const includeSchema = z.object({
  includeFases: z.preprocess(val => val === 'true', z.boolean().default(false)),
  includeComponentes: z.preprocess(val => val === 'true', z.boolean().default(false)),
  includeTestes: z.preprocess(val => val === 'true', z.boolean().default(false)),
  includeFasesEColaboradores: z.preprocess(val => val === 'true', z.boolean().default(false)),
});

export const getAllAeronaves = async (req: Request, res: Response) => {
  try {
    const parsed = includeSchema.parse(req.query);
    const aeronaves = await service.getAllAeronaves(parsed);
    res.json(aeronaves);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAeronaveById = async (req: Request, res: Response) => {
  try {
    const parsed = includeSchema.parse(req.query);
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id);
    const params = { id: parsedID, ...parsed };
    const aeronave = await service.getAeronaveById(params);
    res.json(aeronave);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAeronaveByCodigo = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.string().parse(req.params.id);
    const aeronave = await service.getAeronaveByCodigo(parsedID);
    res.json(aeronave);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createAeronave = async (req: Request, res: Response) => {
  try {
    const aeronave = await service.createAeronave(req.body);
    res.status(201).json(aeronave);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateAeronave = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id);
    const aeronave = await service.updateAeronave(parsedID, req.body);
    res.json(aeronave);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteAeronave = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id);
    await service.deleteAeronave(parsedID);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
