import { z } from "zod";
import { NivelAcesso } from "../generated/prisma/enums";;

export const registerSchema = z.strictObject({
  usuario: z.string().min(3),
  senha: z.string().min(6),
  nome: z.string().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  nivelAcesso: z.enum(NivelAcesso).default(NivelAcesso.OPERADOR)
});

export const loginSchema = z.strictObject({
  usuario: z.string().min(3),
  senha: z.string().min(6)
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;