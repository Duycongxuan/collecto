import { Router } from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './users.route';
import { addressRoute } from './address.route';
import { previewRoute } from './preview.route';
import { bannerRoute } from './banner.route';
import { CategoryRoute } from './category.route';

const router = Router();

// Mount authentication routes at /auth
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/address', addressRoute);
router.use('/previews', previewRoute);
router.use('/banners', bannerRoute);
router.use('/categories', CategoryRoute);

export default router;