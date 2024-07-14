import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsEnum($Enums.UpdateState)
  updateState?: $Enums.UpdateState;

  @IsNotEmpty()
  @IsEnum($Enums.UpdateAt)
  updateAt?: $Enums.UpdateAt;

  @IsNotEmpty()
  @IsBoolean()
  nsfw?: boolean;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  publishedDate?: string;

  @IsNotEmpty()
  @IsString()
  summary?: string;

  @IsNotEmpty()
  @IsUrl()
  cover?: string;
}
