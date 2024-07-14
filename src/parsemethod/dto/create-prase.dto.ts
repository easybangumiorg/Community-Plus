import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePraseMethodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
