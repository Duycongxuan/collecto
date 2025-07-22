import { IsOptional, IsString, IsEmail } from 'class-validator';
import {  } from 'typeorm';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email, please enter your email.'})
  email?: string;
}