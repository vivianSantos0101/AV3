import { Request, Response } from 'express';
import * as service from './testes.service';
import z from 'zod';

// POST /projetos/:id/testes
export const createTeste = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id);
    const novoTeste = await service.createTesteService(req.body, parsedID);
    return res.status(201).json(novoTeste);
  } catch (error) {
    // Provavelmente erro de Foreign Key (Projeto não existe)
    return res.status(500).json({ error: "Erro ao criar teste. Verifique se o ID do projeto existe." });
  }
};

// PUT /testes/:id
export const updateTeste = async (req: Request, res: Response) => {
  try {
    const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id);
    const testeAtualizado = await service.updateTesteService(parsedID, req.body);
    return res.json(testeAtualizado);
  } catch (error) {
    return res.status(404).json({ error: "Teste não encontrado." });
  }
};

// DELETE /testes/:id
export const deleteTeste = async (req: Request, res: Response) => {
  const parsedID = z.coerce.number().pipe(z.int()).parse(req.params.id);

  try {
    await service.deleteTesteService(parsedID);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: "Teste não encontrado." });
  }
};
