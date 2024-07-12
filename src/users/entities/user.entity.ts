import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
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
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  // about
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  // avatar
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  // email
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // password
  @Column()
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
