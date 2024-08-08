import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // username
  @Column()
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  username: string;

  // about
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(0, 200)
  about: string;

  // avatar
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  // email
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // password
  @Exclude()
  @Column({ select: false })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  // wishes
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // offers
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // wishLists
  @OneToMany(() => Wishlist, (Wishlist) => Wishlist.owner)
  wishlist: Wishlist[];
}
