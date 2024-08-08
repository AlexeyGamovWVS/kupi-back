import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
