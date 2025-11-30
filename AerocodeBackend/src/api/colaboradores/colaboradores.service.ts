
import { prisma } from '../../db/prisma';

export const listarColaboradores = async () => {
  return prisma.colaborador.findMany({
    select: {
      id: true,
      nome: true,
      telefone: true,
      usuario: true,
      endereco: true,
      nivelAcesso: true,
    },
  });
};
