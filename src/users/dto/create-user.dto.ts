import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  username: string;

  @Length(0, 200)
  @IsString()
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
