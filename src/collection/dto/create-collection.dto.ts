import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsUrl()
  cover?: string;
}
