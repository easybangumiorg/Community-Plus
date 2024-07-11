import { MinLength, IsEmail, IsString, IsUrl } from 'class-validator';
import { Role } from 'src/shared';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  password: string;

  @MinLength(2, { message: 'Name is too short' })
  name: string;

  @IsString()
  bio?: string;

  @IsUrl()
  avatar?: string;

  @IsString()
  role?: Role;
}
