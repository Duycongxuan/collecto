import { BrandController } from "@/controllers/brand.controller";
import { CreateBrandDto } from "@/dto/brands/create-brand.dto";
import { SearchBrandDto } from "@/dto/brands/search-brand.dto";
import { UpdateBrandDto } from "@/dto/brands/update-brand.dto";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { Role } from "@/enums/enum";
import { AuthMiddleWare } from "@/middlewares/auth.middleware";
import upload from "@/middlewares/upload.middleware";
import { BrandRepository } from "@/repositories/brands.repository";
import { UserRepository } from "@/repositories/users.repository";
import { BrandService } from "@/services/brands.service";
import { UploadService } from "@/services/upload.service";
import { validationMiddleware } from "@/validators/validations";
import { Router } from "express";

export class BrandRoutes {
  private router: Router;
  private authMiddleware!: AuthMiddleWare;
  private brandController!: BrandController;

  constructor() {
    this.router = Router();
    this.initialize();
    this.configureRoutes();
  }

  private initialize(): void {
    const userRepository = new UserRepository();
    const brandRepository = new BrandRepository();
    const uploadService = new UploadService();
    const brandService = new BrandService(brandRepository, uploadService);
    
    this.brandController = new BrandController(brandService);
    this.authMiddleware = new AuthMiddleWare(userRepository);
  }

  private configureRoutes(): void {
    this.router.use(this.authMiddleware.authenticate);
    this.router.use(this.authMiddleware.authorize([Role.ADMIN]))

    this.router.get('/', validationMiddleware(PaginationDto, 'query'), this.brandController.findAllBrands);
    this.router.get('/:id', this.brandController.findById);
    this.router.post('/search', validationMiddleware(SearchBrandDto, 'query'), this.brandController.search);
    this.router.post('/',upload.single('brands') ,validationMiddleware(CreateBrandDto), this.brandController.create);
    this.router.put('/:id',upload.single('brands'), validationMiddleware(UpdateBrandDto), this.brandController.update);
    this.router.patch('/:id', this.brandController.isActiveBrand)
    this.router.delete('/:id', this.brandController.delete);
  }

  getRoutes(): Router {
    return this.router;
  }
}