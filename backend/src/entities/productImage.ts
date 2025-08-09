import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products.entity";

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'productId', nullable: false })
  productId!: number;

  @Column({ name: 'imageUrl', type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ name: 'publicId', type: 'text', nullable: true })
  publicId?: string;

  @Column({ name: 'isPrimary', default: false })
  isPrimary?: boolean;

  @Column({ name: 'sortOrder', nullable: true })
  sortOrder?: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @ManyToOne(() => Product, product => product.images )
  product?: Product;
}