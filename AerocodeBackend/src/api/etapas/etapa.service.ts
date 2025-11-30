import { prisma } from '../../db/prisma';
import { CreateEtapaInput } from '../../schemas/etapa.schema';
import { StatusFase } from '../../generated/prisma/enums';

export const getAllEtapas = (id: number) => {
  return prisma.faseProducao.findMany({
    where: { projetoId: id },
    orderBy: { id: 'asc' }, // garante ordem
  });
};

export const getEtapaById = async (id: number) => {
  const etapa = await prisma.faseProducao.findUnique({ where: { id } });
  if (!etapa) throw new Error("Etapa não encontrada");
  return etapa;
};

export const createEtapa = async (data: CreateEtapaInput) => {
  const { colaboradores, ...rest } = data;
  const last = await prisma.faseProducao.findFirst({
    where: { projetoId: data.projetoId },
    orderBy: { ordem: "desc" }
  });
  
  return prisma.faseProducao.create({
    data: {
      ...rest,
      ordem: (last?.ordem ?? 0) + 1,
      colaboradores: colaboradores
        ? { connect: colaboradores.map(id => ({ id })) }
        : undefined,
    },
  });
};

export const iniciarEtapa = async (projetoId: number) => {
  const fases = await prisma.faseProducao.findMany({
    where: { projetoId },
    orderBy: { ordem: "asc" }
  });

  if (!fases.length) throw new Error("Projeto sem fases");

  const etapaEmExecucao = fases.find(f => f.status === StatusFase.ANDAMENTO);

  if (etapaEmExecucao) {
    throw new Error(`Já existe uma etapa em execução (ordem ${etapaEmExecucao.ordem}).`);
  }

  const proxima = fases.find(f => f.status === StatusFase.PENDENTE);

  if (!proxima) throw new Error("Nenhuma etapa pendente");

  return prisma.faseProducao.update({
    where: { id: proxima.id },
    data: { status: StatusFase.ANDAMENTO }
  });
};

export const concluirEtapa = async (projetoId: number) => {
  const etapa = await prisma.faseProducao.findFirst({
    where: { projetoId, status: StatusFase.ANDAMENTO }
  });

  if (!etapa) throw new Error("Nenhuma etapa em andamento");

  return prisma.faseProducao.update({
    where: { id: etapa.id },
    data: { status: StatusFase.CONCLUIDA }
  });
};


export const associarColaborador = async (id: number, colaboradorId: number) => {
  return prisma.faseProducao.update({
    where: { id },
    data: {
      colaboradores: { connect: { id: colaboradorId } },
    },
  });
};
