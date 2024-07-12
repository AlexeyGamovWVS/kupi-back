import { IsString, IsEmail } from 'class-validator';
export class FindUserDto {
  @IsString()
  username?: string;

  @IsEmail()
  email?: string;
}
