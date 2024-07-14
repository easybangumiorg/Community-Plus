import { $Enums } from '@prisma/client';
import { IsEnum, IsObject, IsString } from 'class-validator';

export class UpdatePraseMethodDto {
  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsEnum($Enums.SiteState)
  state?: $Enums.SiteState;

  @IsObject()
  flow: string;
}
