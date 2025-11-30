import { prisma } from '../../db/prisma';
import { CreateComponenteInput, UpdateComponenteInput } from '../../schemas/componente.schema';

export const getAllComponentes = () => {
  return prisma.componente.findMany();
};

export const getComponenteById = async (id: number) => {
  const componente = await prisma.componente.findUnique({ where: { id } });

  if (!componente)
    throw new Error('Componente não encontrado');

  return componente;
};

export const createComponente = (data: CreateComponenteInput) => {
  return prisma.componente.create({ data });
};

export const updateComponente = async (id: number, data: UpdateComponenteInput) => {
  try {
    return await prisma.componente.update({
      where: { id },
      data,
    });
  } catch {
    throw new Error('Erro ao atualizar componente');
  }
};

export const deleteComponente = async (id: number) => {
  try {
    await prisma.componente.delete({ where: { id } });
  } catch {
    throw new Error('Erro ao deletar componente');
  }
};
