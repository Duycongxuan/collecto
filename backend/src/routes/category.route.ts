import { CategoryController } from "@/controllers/category.controller";
import { CreateCategoryDto } from "@/dto/categories/create-category.dto";
import { SearchCategoryDto } from "@/dto/categories/search-category.dto";
import { UpdateCategoryDto } from "@/dto/categories/update-category.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Role } from "@/enums/enum";
import { AuthMiddleWare } from "@/middlewares/auth.middleware";
import { CategoryRepository } from "@/repositories/categories.repository";
import { UserRepository } from "@/repositories/users.repository";
import { CategoryService } from "@/services/categories.service";
import { validationMiddleware } from "@/validators/validations";
import { Router } from "express";

export class CategoryRoutes {
  private router: Router;
  private authMiddleware!: AuthMiddleWare;
  private categoryController!: CategoryController;

  constructor(){
    this.router = Router();
    this.initialize();
    this.configureRoutes();
  }

  private initialize(): void {
    const userRepository = new UserRepository();
    const categoryRepository = new CategoryRepository();
    const categoryService = new CategoryService(categoryRepository);

    this.categoryController = new CategoryController(categoryService);
    this.authMiddleware = new AuthMiddleWare(userRepository);
  }

  private configureRoutes(): void {
    this.router.use(this.authMiddleware.authenticate);
    this.router.use(this.authMiddleware.authorize([Role.ADMIN]));

    this.router.get('/', validationMiddleware(PaginationDto, 'query'), this.categoryController.findAllCategories);
    this.router.get('/:id', this.categoryController.findByCategoryId);
    this.router.post('/', validationMiddleware(CreateCategoryDto), this.categoryController.create);
    this.router.post('/search', validationMiddleware(PaginationDto, 'query'), validationMiddleware(SearchCategoryDto), this.categoryController.search);
    this.router.put('/:id', validationMiddleware(UpdateCategoryDto), this.categoryController.update);
    this.router.patch('/:id', this.categoryController.isActiveCategory);
    this.router.delete('/:id', this.categoryController.delete);
  }

  getRoutes(): Router {
    return this.router;
  }
}