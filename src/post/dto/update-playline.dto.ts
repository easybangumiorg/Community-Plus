import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlaylineDto {
  @IsNotEmpty()
  @IsInt()
  parseMethodId?: number;

  @IsNotEmpty()
  @IsString()
  title?: string;
}
