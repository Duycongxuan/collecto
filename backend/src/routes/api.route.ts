import { Router } from "express";
import { UserRoutes } from "./users.route";
import { AuthRoutes } from "./auth.route";
import { CategoryRoutes } from "./category.route";
import { BrandRoutes } from "./brand.route";

export class ApiRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.use('/users', new UserRoutes().getRoutes());
    this.router.use('/auth', new AuthRoutes().getRoutes());
    this.router.use('/categories', new CategoryRoutes().getRoutes());
    this.router.use('/brands', new BrandRoutes().getRoutes());
  }
  getRoutes(): Router {
    return this.router;
  }
}