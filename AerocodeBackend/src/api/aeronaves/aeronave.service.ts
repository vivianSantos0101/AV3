import { prisma } from '../../db/prisma';
import { CreateAeronaveInput, UpdateAeronaveInput } from '../../schemas/aeronave.schema';

interface IncludeParams {
  includeFases?: boolean;
  includeComponentes?: boolean;
  includeTestes?: boolean;
  includeFasesEColaboradores?: boolean;
}

export const getAllAeronaves = async (params: IncludeParams) => {
  const include: Record<string, any> = {};

  if (params.includeFases || params.includeFasesEColaboradores) {
    include.fases = {
      include: { colaboradores: params.includeFasesEColaboradores || false },
    };
  }

  if (params.includeComponentes) include.componentes = true;
  if (params.includeTestes) include.testes = true;

  const projetos = await prisma.projetoAeronave.findMany({ include });
  return projetos;
};

export const getAeronaveById = async (params: IncludeParams & { id: number }) => {
  const include: Record<string, any> = {};

  if (params.includeFases || params.includeFasesEColaboradores) {
    include.fases = {
      include: { colaboradores: params.includeFasesEColaboradores || false },
    };
  }

  if (params.includeComponentes) include.componentes = true;
  if (params.includeTestes) include.testes = true;

  const projeto = await prisma.projetoAeronave.findUnique({
    where: { id: params.id },
    include,
  });

  return projeto;
};

export const getAeronaveByCodigo = async (codigo: string) => {
  return prisma.projetoAeronave.findUnique({
    where: { codigo },
  });
};

export const createAeronave = async (data: CreateAeronaveInput) => {
  return prisma.projetoAeronave.create({ data });
};

export const updateAeronave = async (id: number, data: UpdateAeronaveInput) => {
  return prisma.projetoAeronave.update({
    where: { id },
    data,
  });
};

export const deleteAeronave = async (id: number) => {
  return prisma.projetoAeronave.delete({
    where: { id },
  });
};
