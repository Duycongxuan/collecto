import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email, please enter your email.'})
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Too short, enter at least 4 characters'})
  password!: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword!: string;
}