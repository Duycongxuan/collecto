import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

// Initialize the router and required components
const router = Router();
const authMiddleWare = new AuthMiddleWare();
const userController = new UserController();

// --- PROTECTED ROUTES ---
// Apply the 'authenticate' middleware to all routes defined in this file.
// This ensures that a user must be logged in with a valid token to access any of these endpoints.
router.use(authMiddleWare.authenticate);


// --- ROUTE DEFINITIONS ---

// GET /api/v1/users/profile
// Retrieves the profile of the currently authenticated user.
router.get('/profile', userController.getProfile);

// PUT /api/v1/users/update
// Updates the information of the currently authenticated user.
router.put('/update', userController.update);

// PUT /api/v1/users/change-password
// Changes the password for the currently authenticated user.
router.put('/change-password', userController.changePassword);


// Export the configured router as `userRoute`
export { router as userRoute };