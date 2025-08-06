import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'userId' })
  userId?: number;

  @Column({ name: 'token' })
  token?: string;

  @Column({ name: 'isRevoked', default: false })
  isRevoked?: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @Column({ name: 'expireAt', type: 'timestamp' })
  expireAt?: Date;

  /**
   * Many tokens can belong to one user
   */
  @ManyToOne(() => User, user => user.tokens)
  user?: User;
}