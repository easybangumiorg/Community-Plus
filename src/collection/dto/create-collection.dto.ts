import { IsString, IsUrl } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsUrl()
  cover?: string;
}
