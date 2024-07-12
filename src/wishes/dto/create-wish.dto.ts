import {
  IsDecimal,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  Min,
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
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  raised?: number;

  @Length(0, 1024)
  description?: string;
}
