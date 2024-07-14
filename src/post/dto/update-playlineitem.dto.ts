import { IsString } from 'class-validator';

export class UpdatePlaylineItemDto {
  @IsString()
  title?: string;

  @IsString()
  item?: string;
}
