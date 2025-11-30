import { z } from "zod";
import { StatusComponente, TipoComponente } from "../generated/prisma/enums";

export const createComponenteSchema = z.strictObject({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(TipoComponente), 
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  status: z.enum(StatusComponente),
  projetoId: z.int().positive(),
});

export const updateComponenteSchema = z.strictObject(
  createComponenteSchema.shape
).partial();

export type CreateComponenteInput = z.infer<typeof createComponenteSchema>;
export type UpdateComponenteInput = z.infer<typeof updateComponenteSchema>;