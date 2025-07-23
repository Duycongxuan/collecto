import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('addresses')
export class Addresses {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'userId' })
  userId!: number;

  @Column({ name: 'recipe_name' })
  recipeName?: string;

  @Column({ name: 'recipe_phone'})
  recipePhone?: string;

  @Column({ name: 'address' })
  address?: string;

  @Column({ name: 'province' })
  provice?: string;

  @Column({ name: 'ward' })
  ward?: string;

  @Column({ name: 'is_default', type: 'bool', default: false })
  isDefault?: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, user => user.address)
  user?: User;
}