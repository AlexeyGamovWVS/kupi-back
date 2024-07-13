import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // wishlist name
  @Column()
  @Length(1, 250)
  @IsString()
  @IsNotEmpty()
  name: string;

  // wishlist caption
  @Column({ default: '' })
  @Length(0, 1500)
  @IsString()
  description: string;

  // wishlist badge image
  @Column()
  @IsUrl()
  image: string;

  // wishes
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  // wishlist owner
  @ManyToOne(() => User, (user) => user.wishlist)
  owner: User;
}
