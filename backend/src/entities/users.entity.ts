import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Role, Status } from '../utils/enum';
import { Token } from './tokens.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name' })
  name?: string;

  @Column({ name: 'email', unique: true })
  email?: string;

  @Column({ name: 'password', select: false })
  password?: string;

  @Column({ name: 'role', type: 'enum', enum: Role, default: Role.USER })
  role?: string;

  @Column({ name: 'status', type: 'enum', enum: Status, default: Status.ACTIVE })
  status?: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp' })
  deletedAt?: Date;

  /**
   * One user can have multiple tokens (refresh tokens)
   */
  @OneToMany(() => Token, token => token.user)
  tokens?: Token[];
}