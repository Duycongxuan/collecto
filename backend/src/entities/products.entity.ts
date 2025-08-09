import { DifficultyLevel, Scale } from "@/enums/enum";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./categories.entity";
import { Brand } from "./brands.entity";
import { ProductImage } from "./productImage";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'sku' })
  sku!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true})
  description?: string;

  @Column({ name: 'details', type: 'text', nullable: true})
  details?: string;

  @Column({ name: 'categoryId', nullable: false })
  categoryId!: number;

  @Column({ name: 'brandId', nullable: false })
  brandId!: number;

  @Column({ name: 'scale', type: 'enum', enum: Scale})
  scale?: string

  @Column({ name :'difficultyLevel', type: 'enum', enum: DifficultyLevel })
  difficultyLevel?: string;

  // Chất liệu (Plastic, Resin, Metal)
  @Column({ name: 'material' })
  material?: string;

  // Trọng lượng (gram)
  @Column({ name: 'weight' })
  weight?: string;

  // Kích thước (dài x rộng x cao)
  @Column({ name: 'dimensions' })
  dimensions?: string;

  @Column({ name: 'ageRating' })
  ageRating?: string;

  @Column({ name: 'originalPrice', type: 'decimal', default: 0 })
  originalPrice?: number;

  @Column({ name: 'sellingPrice', type: 'decimal', default: 0 })
  sellingPrice?: number;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive?: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true})
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @ManyToOne(() => Category, category => category.products)
  category?: Category;

  @ManyToOne(() => Brand, brand => brand.products)
  brand?: Brand;

  @OneToMany(() => ProductImage, image => image.product)
  images?: ProductImage[];
}