import { Router } from 'express';
import * as controller from './componente.controller.js';

import { validateSchema } from '../../middlewares/schema.middleware.js';
import { authorize } from '../../middlewares/index.js';
import { NivelAcesso } from '../../generated/prisma/enums.js';

import {
  createComponenteSchema,
  updateComponenteSchema,
} from '../../schemas/componente.schema.js';

const router = Router();

router.get('/', controller.getAllComponentes);


router.get('/:id',
  controller.getComponenteById
);

router.post('/',
  authorize(NivelAcesso.ENGENHEIRO),
  validateSchema(createComponenteSchema),
  controller.createComponente
);


router.put('/:id',
  authorize(NivelAcesso.ENGENHEIRO),
  validateSchema(updateComponenteSchema),
  controller.updateComponente
);


router.delete('/:id',
  authorize(NivelAcesso.ADMINISTRADOR),
  controller.deleteComponente
);

export default router;
