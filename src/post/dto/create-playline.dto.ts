import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylineDto {
  @IsNotEmpty()
  @IsInt()
  parseMethodId: number;

  @IsNotEmpty()
  @IsString()
  title: string;
}
