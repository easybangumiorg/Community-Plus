import { IsEnum, IsString, IsUrl } from 'class-validator';
import { Role } from 'src/shared';

export class UpdateCollectionDto {
  @IsString()
  title?: string;

  @IsString()
  summary?: string;

  @IsUrl()
  cover?: string;

  @IsEnum(Role)
  status?: Role;
}
