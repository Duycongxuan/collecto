import { Router } from 'express';
import { authRoute } from './auth.route';

const router = Router();

// Mount authentication routes at /auth
router.use('/auth', authRoute);

export default router;