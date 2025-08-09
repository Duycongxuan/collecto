import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./products.entity";

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', nullable: false, unique: true })
  name!: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'logoUrl', type: 'text', nullable: true })
  logoUrl?: string;

  @Column({ name: 'publicId', type: 'text', nullable: true })
  publicId?: string;

  @Column({ name: 'website', type: 'text' })
  website?: string;

  @Column({ name: 'country' })
  country?: string;

  @Column({ name: 'isActive', default: true })
  isActive?: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @OneToMany(() => Product, product => product.brand)
  products?: Product[];
}