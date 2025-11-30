import { z } from "zod";
import { TipoAeronave } from "../generated/prisma/enums";

export const createAeronaveSchema = z.strictObject({
  codigo: z.string().min(1, "O código é obrigatório."),
  modelo: z.string().min(1, "O modelo é obrigatório."),
  tipo: z.enum(TipoAeronave),
  capacidade: z.int().positive("A capacidade deve ser um número inteiro positivo."),
  alcance: z.int().positive("O alcance deve ser um número inteiro positivo."),
}); // Garante que não haja campos extras no Body

// Schema para a rota PUT (Sugestão de melhoria)
// Torne os campos opcionais e remova a validação do ID do body, focando no param
export const updateAeronaveSchema = z.strictObject(
  createAeronaveSchema.shape
).partial();

export type CreateAeronaveInput = z.infer<typeof createAeronaveSchema>;
export type UpdateAeronaveInput = z.infer<typeof updateAeronaveSchema>;