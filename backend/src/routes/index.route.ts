import { Router } from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './users.route';
import { addressRoute } from './address.route';

const router = Router();

// Mount authentication routes at /auth
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/address', addressRoute);

export default router;