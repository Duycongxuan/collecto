import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'title', type: 'text' })
  title?: string;

  @Column({ name: 'description', type: 'text' })
  description?: string;

  @Column({ name: 'imageUrl', type: 'text'})
  imageUrl?: string;

  @Column({ name: 'publicId' })
  publicId?: string;

  @Column({ name: 'redirectLink', type: 'text' })
  redirectLink?: string;

  @Column({ name: 'displayOrder', nullable: true })
  displayOrder?: number;

  @Column({ name: 'startDate', type: 'date', nullable: false })
  startDate?: Date;

  @Column({ name: 'endDate', type: 'date' })
  endDate?: Date;
  
  @Column({ name: 'isActive', type: 'boolean', default: false })
  isActive?: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}