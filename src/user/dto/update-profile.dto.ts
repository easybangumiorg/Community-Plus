import { IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @MinLength(2, { message: 'Name is too short' })
  name?: string;

  @IsString()
  bio?: string;

  @IsUrl()
  avatar?: string;
}
