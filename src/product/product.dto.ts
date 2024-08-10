import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  description: string;
}
