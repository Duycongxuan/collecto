import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email, please enter your email.'})
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Too short, enter at least 4 characters'})
  password!: string;
}