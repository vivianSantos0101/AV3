import express from 'express';
import * as controller from './aeronave.controller';

import { validateSchema } from '../../middlewares/schema.middleware';
import { authorize } from '../../middlewares';
import { NivelAcesso } from '../../generated/prisma/enums';
import { createAeronaveSchema, updateAeronaveSchema } from '../../schemas/aeronave.schema';

const router = express.Router();

router.get('/', controller.getAllAeronaves);

router.get('/:id', 
    controller.getAeronaveById
);

router.get('/codigo/:id', 
    controller.getAeronaveByCodigo
);

router.post('/', 
    authorize(NivelAcesso.ENGENHEIRO), 
    validateSchema(createAeronaveSchema), 
    controller.createAeronave
);

router.put('/:id', 
    authorize(NivelAcesso.ENGENHEIRO), 
    validateSchema(updateAeronaveSchema), 
    controller.updateAeronave
);

router.delete('/:id', 
    authorize(NivelAcesso.ADMINISTRADOR),
    controller.deleteAeronave
);


export default router;
