import { IsEmail, IsEnum, IsString, IsUrl, MinLength } from 'class-validator';
import { Role } from 'src/shared';

export class UpdateUserDto {
  @MinLength(2, { message: 'Name is too short' })
  name?: string;

  @IsString()
  bio?: string;

  @IsUrl()
  avatar?: string;

  @IsEnum(Role)
  role?: Role;

  @IsString()
  password?: string;

  @IsEmail()
  email?: string;
}
