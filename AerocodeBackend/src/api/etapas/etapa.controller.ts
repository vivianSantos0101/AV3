import { Request, Response } from 'express';
import * as service from './etapa.service';
import z from 'zod';

export const getAllEtapas = async (req: Request, res: Response) => {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id)
    const etapas = await service.getAllEtapas(parsedID);
    res.json(etapas);
};

export const getEtapaById = async (req: Request, res: Response) => {
    try {
        const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id)
        const etapa = await service.getEtapaById(parsedID);
        res.json(etapa);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

export const createEtapa = async (req: Request, res: Response) => {
    try {
        const etapa = await service.createEtapa(req.body);
        res.status(201).json(etapa);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const iniciarEtapa = async (req: Request, res: Response) => {
    try {
        const parsedID = z.coerce.number().pipe(z.int()).parse(req.body.projetoId)
        const etapa = await service.iniciarEtapa(parsedID);
        res.json(etapa);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const concluirEtapa = async (req: Request, res: Response) => {
    try {
        const parsedID = z.coerce.number().pipe(z.int()).parse(req.body.projetoId)
        const etapa = await service.concluirEtapa(parsedID);
        res.json(etapa);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const associarColaborador = async (req: Request, res: Response) => {
    try {
        const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id)
        const colaboradorId = z.coerce.number().pipe(z.int()).parse(req.body.colaboradorId);
        const etapa = await service.associarColaborador(parsedID, colaboradorId);
        res.json(etapa);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
