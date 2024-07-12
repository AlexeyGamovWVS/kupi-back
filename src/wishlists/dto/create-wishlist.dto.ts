import { IsString, Length, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Length(0, 1500)
  @IsString()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  items: number[];
}
