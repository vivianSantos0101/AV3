import { z } from "zod";
import { StatusFase } from "../generated/prisma/enums";

// Criar etapa
export const createEtapaSchema = z.strictObject({
  nome: z.string().min(1, "Nome é obrigatório"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  status: z.enum(StatusFase).optional().default(StatusFase.PENDENTE),
  projetoId: z.int().positive(),
  colaboradores: z.array(z.number().int().positive()).optional()
});

// Tipos inferidos
export type CreateEtapaInput = z.infer<typeof createEtapaSchema>;