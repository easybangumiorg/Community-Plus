import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylineItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  item?: string;
}
