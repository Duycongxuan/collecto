import { CategoryController } from "@/controllers/category.controller";
import { AuthMiddleWare } from "@/middlewares/auth.middleware";
import { Role } from "@/utils/enum";
import { Router } from "express";

const router = Router();
const authMiddleware = new AuthMiddleWare();
const categoryController = new CategoryController();

router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize([Role.ADMIN]));

router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findByCategoryId);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export { router as CategoryRoute };