import { Router } from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './users.route';

const router = Router();

// Mount authentication routes at /auth
router.use('/auth', authRoute);
router.use('/users', userRoute);

export default router;