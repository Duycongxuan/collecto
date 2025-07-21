import { AuthMiddleWare } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';
import { Router } from 'express';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleWare();

// Route for user registration
router.post('/register', authController.register);
// Route for user login
router.post('/login', authController.login);
// Route for user logout (requires authentication)
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.post('/reset-token', authMiddleware.authenticate, authController.resetToken);

export { router as authRoute }