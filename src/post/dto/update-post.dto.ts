import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsObject,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdatePostDto {
  @IsEnum($Enums.SiteState)
  state?: $Enums.SiteState;

  @IsEnum($Enums.UpdateState)
  updateState?: $Enums.UpdateState;

  @IsEnum($Enums.UpdateAt)
  updateAt?: $Enums.UpdateAt;

  @IsBoolean()
  nsfw?: boolean;

  @IsString()
  title?: string;

  @IsDateString()
  publishedDate?: string;

  @IsString()
  summary?: string;

  @IsUrl()
  cover?: string;

  @IsObject()
  extendmetaData?: any;
}
