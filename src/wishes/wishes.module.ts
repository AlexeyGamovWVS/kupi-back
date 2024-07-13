import { Module, forwardRef } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    forwardRef(() => UsersModule),
    AuthModule,
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
