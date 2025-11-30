import { Router } from 'express';
import { register, login, me, logout } from './auth.controller';

import { validateSchema } from '../../middlewares/schema.middleware';
import { registerSchema, loginSchema } from '../../schemas/auth.schema';
import { authorize, requireAuth } from '../../middlewares';
import { NivelAcesso } from '../../generated/prisma/enums';

const router = Router();

router.post('/register', authorize(NivelAcesso.ADMINISTRADOR), validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post("/logout", logout)

// requireAuth é necessario para validação do req.cookies
router.get('/me', requireAuth, me)

export default router;
