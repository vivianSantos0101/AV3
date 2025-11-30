import { prisma } from "../../db/prisma";
import { CreateTesteInput, UpdateTesteInput } from "../../schemas/testes.schema";

export const createTesteService = async (data: CreateTesteInput, projetoId: number) => {
  return prisma.teste.create({
    data: {
      tipo: data.tipo,
      resultado: data.resultado,
      projeto: {
        connect: { id: projetoId },
      },
    },
  });
};

export const updateTesteService = async (id: number, data: UpdateTesteInput) => {
  return prisma.teste.update({
    where: { id },
    data,
  });
};

export const deleteTesteService = async (id: number) => {
  return prisma.teste.delete({
    where: { id },
  });
};
