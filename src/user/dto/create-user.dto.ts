import {
  MinLength,
  IsEmail,
  IsString,
  IsUrl,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/shared';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @MinLength(2, { message: 'Name is too short' })
  @IsNotEmpty()
  name: string;

  @IsString()
  bio?: string;

  @IsUrl()
  avatar?: string;

  @IsString()
  @IsEnum(Role)
  role?: Role;
}
