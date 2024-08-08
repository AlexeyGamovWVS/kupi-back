import { IsDecimal, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Who ready to pay
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  // Wish
  @ManyToOne(() => Wish, (wish) => wish.link)
  item: Wish;

  // sum of application
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
  })
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  raised: number;

  // to show info about user
  @Column({ default: false })
  hidden: boolean;
}
