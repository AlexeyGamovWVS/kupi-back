import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // wish name
  @Column()
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  // shop link
  @Column()
  @IsUrl()
  link: string;

  // wish avatar (image)
  @Column()
  @IsUrl()
  image: string;

  // cost price
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
  })
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  price: number;

  // total sum ready to pay
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
  })
  @IsDecimal({ decimal_digits: '2' })
  @Min(1)
  raised: number;

  // owners of this wish
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  // wish description
  @Column()
  @IsString()
  @Length(0, 1024)
  description: string;

  // asks from users
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // wish copied counter
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0,
  })
  @IsInt()
  copied: number;
}
