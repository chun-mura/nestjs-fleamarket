import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsEnum,
  IsStrongPassword,
} from 'class-validator';
import { UserStatus } from '../../../generated/prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsEnum(UserStatus)
  status: UserStatus;
}
