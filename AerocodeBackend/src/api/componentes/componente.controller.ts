import { Request, Response } from 'express';
import * as service from './componente.service.js';
import z from 'zod';

export const getAllComponentes = async (req: Request, res: Response) => {
  const componentes = await service.getAllComponentes();
  res.json(componentes);
};

export const getComponenteById = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id)
    const componente = await service.getComponenteById(parsedID);
    res.json(componente);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const createComponente = async (req: Request, res: Response) => {
  try {
    const componente = await service.createComponente(req.body);
    res.status(201).json(componente);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateComponente = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id)
    const componente = await service.updateComponente(
      parsedID,
      req.body
    );
    res.json(componente);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteComponente = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id)
    await service.deleteComponente(parsedID);
    res.json({ message: 'Componente deletado' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
