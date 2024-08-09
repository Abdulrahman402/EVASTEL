import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
