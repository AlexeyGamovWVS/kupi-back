import { IsDecimal, Min } from 'class-validator';

export class CreateOfferDto {
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  raised: number;

  hidden?: boolean;
  itemId: number;
}
