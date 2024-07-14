import { $Enums } from '@prisma/client';
import { IsEnum, IsString, IsUrl } from 'class-validator';

export class UpdateCollectionDto {
  @IsString()
  title?: string;

  @IsString()
  summary?: string;

  @IsUrl()
  cover?: string;

  @IsEnum($Enums.SiteState)
  status?: $Enums.SiteState;
}
