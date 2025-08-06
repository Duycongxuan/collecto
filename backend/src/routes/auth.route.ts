import { AuthController } from "@/controllers/auth.controller";
import { LoginDto } from "@/dto/auth/login.dto";
import { RegisterDto } from "@/dto/auth/register.dto";
import { AuthMiddleWare } from "@/middlewares/auth.middleware";
import { TokenRepository } from "@/repositories/token.repository";
import { UserRepository } from "@/repositories/users.repository";
import { AuthService } from "@/services/auth.service";
import { validationMiddleware } from "@/validators/validations";
import { Router } from "express";

export class AuthRoutes {
  private router: Router;
  private authController!: AuthController;
  private authMiddleware!: AuthMiddleWare;
  constructor() {
    this.router = Router();
    this.initialize();
    this.configureRoutes();
  }

  initialize(): void {
    const userRepository = new UserRepository();
    const tokenRepository = new TokenRepository();
    const authService = new AuthService(userRepository, tokenRepository);
    
    this.authController = new AuthController(authService);
    this.authMiddleware = new AuthMiddleWare(userRepository);
  }

  configureRoutes(): void {
    this.router.post('/register', validationMiddleware(RegisterDto) ,this.authController.register);
    this.router.post('/login',validationMiddleware(LoginDto) ,this.authController.login);
    this.router.post('/reset-token', this.authController.resetToken);

    this.router.use(this.authMiddleware.authenticate);
    this.router.post('/logout', this.authController.logout);
  }

  getRoutes(): Router {
    return this.router;
  }
}