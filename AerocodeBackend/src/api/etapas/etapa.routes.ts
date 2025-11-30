import { Router } from 'express';
import * as controller from './etapa.controller';
import { validateSchema } from '../../middlewares/schema.middleware';
import { authorize } from '../../middlewares';
import { NivelAcesso } from '../../generated/prisma/enums';
import { createEtapaSchema } from '../../schemas/etapa.schema';

const router = Router();

// Listar todas as etapas de um projeto
router.get('/aeronave/:id',
  controller.getAllEtapas
);

// Obter etapa por ID
router.get('/:id',
  controller.getEtapaById
);

// Criar etapa de projeto (ENGENHEIRO ou ADMIN)
router.post('/', 
  authorize(NivelAcesso.ENGENHEIRO),
  validateSchema(createEtapaSchema),
  controller.createEtapa
);

// Iniciar etapa
router.put('/iniciar',
  authorize(NivelAcesso.ENGENHEIRO),
  controller.iniciarEtapa
);

// Concluir etapa (verifica anterior)
router.put('/concluir',
  authorize(NivelAcesso.ENGENHEIRO),
  controller.concluirEtapa
);

// Adicionar funcionário
router.post('/:id/colaboradores',
  authorize(NivelAcesso.ADMINISTRADOR),
  controller.associarColaborador
);

export default router;
