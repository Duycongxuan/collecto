import { GENDER } from '@/enums/enum';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import {  } from 'typeorm';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email, please enter your email.'})
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: string;
}