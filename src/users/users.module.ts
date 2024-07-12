import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { ConfigService } from '@nestjs/config';
import { WishesService } from 'src/wishes/wishes.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  controllers: [UsersController],
  providers: [UsersService, WishesService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
