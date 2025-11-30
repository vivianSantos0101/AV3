import { Router } from 'express';
import { getColaboradores } from './colaboradores.controller';

const router = Router();

router.get('/', getColaboradores);

export default router;
