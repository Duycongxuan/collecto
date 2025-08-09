import { ProductController } from "@/controllers/product.controller";
import { PaginationDto } from "@/dto/pagination/pagination.dto";
import { CreateProductDto } from "@/dto/products/create-product.dto";
import { UpdateProductDto } from "@/dto/products/update-product.dto";
import { Role } from "@/enums/enum";
import { AuthMiddleWare } from "@/middlewares/auth.middleware";
import upload from "@/middlewares/upload.middleware";
import { ProductImageRepository } from "@/repositories/productImage.repository";
import { ProductRepository } from "@/repositories/products.repository";
import { UserRepository } from "@/repositories/users.repository";
import { ProductService } from "@/services/products.service";
import { UploadService } from "@/services/upload.service";
import { validationMiddleware } from "@/validators/validations";
import { Router } from "express";

export class ProductRoutes {
  private readonly router: Router;
  private productController!: ProductController;
  private authMiddleware!: AuthMiddleWare;

  constructor() {
    this.router = Router();
    this.initialize();
    this.configureRoutes();
  }

  private initialize(): void {
    const productRepository = new ProductRepository();
    const userRepository = new UserRepository();
    const productImageRepository = new ProductImageRepository();
    const uploadService = new UploadService();
    const productService = new ProductService(productRepository,productImageRepository ,uploadService);

    this.productController = new ProductController(productService);
    this.authMiddleware = new AuthMiddleWare(userRepository);
  }

  private configureRoutes(): void {
    this.router.use(this.authMiddleware.authenticate);
    this.router.use(this.authMiddleware.authorize([Role.ADMIN]));

    this.router.get('/', validationMiddleware(PaginationDto, 'query'), this.productController.findAllProducts);
    this.router.get('/:id', this.productController.findByProductId);
    this.router.post('/', upload.array('products', 10), validationMiddleware(CreateProductDto), this.productController.create);
    this.router.put('/:id', upload.array('products', 10), validationMiddleware(UpdateProductDto), this.productController.update);
    this.router.patch('/:id', this.productController.isActiveProduct);
    this.router.delete('/:id', this.productController.delete);
  }

  getRoutes(): Router{
    return this.router;
  }
}