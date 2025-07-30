import { Role } from '../utils/enum';
import { AuthMiddleWare } from '../middlewares/auth.middleware';
import { Router } from 'express';
import { BannerController } from '@/controllers/banner.controller';

const router = Router();
const authMiddleware = new AuthMiddleWare();
const bannerController = new BannerController();

router.use(authMiddleware.authenticate);
//router.use(authMiddleware.authorize([Role.ADMIN]));
router.get('/', bannerController.fillAll);
router.get('/search', bannerController.search);
router.get('/:id', bannerController.findByBannerId);
router.post('/', bannerController.create);
router.put('/:id', bannerController.update);
router.patch('/:id/status', bannerController.updateStatus);
router.delete('/:id', bannerController.delete);

export { router as bannerRoute }