import {
  IsDecimal,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  price: number;

  @Length(0, 1024)
  description?: string;
}
