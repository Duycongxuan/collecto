import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { GENDER, Role, Status } from '../enums/enum';
import { Token } from './tokens.entity';
import { Addresses } from './addresses.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name' })
  name?: string;

  @Column({ name: 'email', unique: true })
  email?: string;

  @Column({ name: 'phoneNumber', unique: true, nullable: true})
  phoneNumber?: string;

  @Column({ name: 'dateOfBirth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ name: 'gender', type: 'enum', enum: GENDER, nullable: true })
  gender?: string;

  @Column({ name: 'password'})
  password?: string;

  @Column({ name: 'rewardPoints', default: 0 })
  rewardPoint?: number;

  @Column({ name: 'role', type: 'enum', enum: Role, default: Role.USER })
  role?: string;

  @Column({ name: 'status', type: 'enum', enum: Status, default: Status.ACTIVE })
  status?: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  /**
   * One user can have multiple tokens (refresh tokens)
   */
  @OneToMany(() => Token, token => token.user)
  tokens?: Token[];

  @OneToMany(() => Addresses, address => address.user)
  address?: Addresses[];
}