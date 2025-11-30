import { Router } from 'express';
import * as controller from './testes.controller';
import { validateSchema } from '../../middlewares/schema.middleware';
import { 
    createTesteSchema, 
    updateTesteSchema, 
} from '../../schemas/testes.schema'

const router = Router();

router.post(
    '/aeronave/:id', 
    validateSchema(createTesteSchema), 
    controller.createTeste
);


router.put(
    '/testes/:id', 
    validateSchema(updateTesteSchema), 
    controller.updateTeste
);


router.delete(
    '/testes/:id', 
    controller.deleteTeste
);

export default router;