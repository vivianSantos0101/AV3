import { z } from "zod";
import { TipoTeste, ResultadoTeste } from "../generated/prisma/enums";

// POST /projetos/:id/testes
// O :id aqui refere-se ao projetoId
export const createTesteSchema = z.strictObject({
    tipo: z.enum(TipoTeste),
    resultado: z.enum(ResultadoTeste),
});

// PUT /testes/:id
// O :id aqui refere-se ao id do Teste
export const updateTesteSchema = z.strictObject(
    createTesteSchema.shape
).partial();

export type CreateTesteInput = z.infer<typeof createTesteSchema>;
export type UpdateTesteInput = z.infer<typeof updateTesteSchema>;