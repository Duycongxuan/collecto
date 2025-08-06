import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { AuthMiddleWare } from "../middlewares/auth.middleware";
import { UserService } from "@/services/users.service";
import { UserRepository } from "@/repositories/users.repository";
import { validationMiddleware } from "@/validators/validations";
import { Role } from "@/enums/enum";
import { CreateUserDto } from "@/dto/users/create-user.dto";
import { UpdateUserDto } from "@/dto/users/update-user.dto";
import { ChangePasswordDto } from "@/dto/users/change-password.dto";

export class UserRoutes {
  private router: Router;
  private controller!: UserController;
  private authMiddleware!: AuthMiddleWare;
  
  constructor() {
    this.router = Router();
    this.initializeDependencies();
    this.configureRoutes();
  }

  private initializeDependencies(): void {
    const repository = new UserRepository();
    const service = new UserService(repository);

    this.controller = new UserController(service);
    this.authMiddleware = new AuthMiddleWare(repository);
  }

  private configureRoutes(): void {
    this.router.use(this.authMiddleware.authenticate);
    this.router.post('/',this.authMiddleware.authorize([Role.ADMIN]) ,validationMiddleware(CreateUserDto), this.controller.create);
    this.router.get('/profile' ,this.controller.getProfile);
    this.router.put('/', validationMiddleware(UpdateUserDto),this.controller.update);
    this.router.patch('/change-password', validationMiddleware(ChangePasswordDto),this.controller.changePassword);
  }

  getRoutes(): Router {
    return this.router;
  }
}