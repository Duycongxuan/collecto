import { GENDER } from "@/enums/enum";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth!: Date;

  @IsNotEmpty()
  @IsEnum(GENDER)
  gender!: string;
}