import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesModule } from 'src/wishes/wishes.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wish]),
    forwardRef(() => WishesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
