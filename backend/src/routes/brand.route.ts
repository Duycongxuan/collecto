import { BrandController } from "@/controllers/brand.controller";
import { AuthMiddleWare } from "@/middlewares/auth.middleware";
import { Role } from "@/utils/enum";
import { Router } from "express";

const router = Router();

const authMiddleware = new AuthMiddleWare();
const brandController = new BrandController();

router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize([Role.ADMIN]));

router.get('/', brandController.findAll);
router.get('/:id', brandController.findById);
router.post('/', brandController.create);
router.put('/:id', brandController.update);
router.delete('/:id', brandController.delete);

export { router as brandRoute }