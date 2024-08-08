import { IsDecimal } from 'class-validator';

export class CreateOfferDto {
  @IsDecimal({ decimal_digits: '2' })
  amount: number;

  hidden?: boolean;
  itemId: number;
}
