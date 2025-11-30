import { prisma } from '../../db/prisma';

export const gerarRelatorioService = async (projetoId: number) => {
  const relatorio = await prisma.projetoAeronave.findUnique({
    where: { 
      id: projetoId 
    },
    include: {
      componentes: true,
      testes: true,
      fases: {
        include: {
          colaboradores: true, 
        },
        orderBy: {
          id: 'asc' 
        }
      },
    },
  });

  return relatorio;
};
