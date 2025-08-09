import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './products.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name"})
  name!: string;

  @Column({ name: "description", type: 'text' })
  description!: string;

  @Column({ name: 'isActive', default: false })
  isActive?: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true})
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @OneToMany(() => Product, product => product.category)
  products?: Product[];
}