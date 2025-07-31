import { Column, CreateDateColumn, DeleteDateColumn, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Brand {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', nullable: false, unique: true })
  name!: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'logoUrl', type: 'text' })
  logoUrl?: string;

  @Column({ name: 'publicId', type: 'text' })
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
}