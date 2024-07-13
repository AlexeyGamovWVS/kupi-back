import {
  IsString,
  Length,
  IsNotEmpty,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Length(0, 1500)
  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  itemsId: number[];
}
