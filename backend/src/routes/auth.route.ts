import { AuthMiddleWare } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';
import { Router } from 'express';

// Initialize the router and required components
const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleWare();

// --- AUTHENTICATION ROUTES ---
// These routes handle user registration, login, and session management.


// === PUBLIC ROUTES ===

// POST /api/auth/register
// Endpoint for creating a new user account.
router.post('/register', authController.register);

// POST /api/auth/login
// Endpoint for authenticating a user and issuing tokens.
router.post('/login', authController.login);


// === PROTECTED ROUTES ===
// These routes require a valid authentication token to be accessed.
// The `authMiddleware.authenticate` is executed first to verify the user's identity.

// POST /api/auth/logout
// Logs out the authenticated user (e.g., by invalidating the token).
router.post('/logout', authMiddleware.authenticate, authController.logout);

// POST /api/auth/reset-token
// Refreshes an expired access token, typically using a refresh token.
router.post('/reset-token', authMiddleware.authenticate, authController.resetToken);

// Export the configured router
export { router as authRoute };