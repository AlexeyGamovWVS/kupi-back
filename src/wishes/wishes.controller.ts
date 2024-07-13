import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';

import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesService.create(user.id, createWishDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(+id, user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.remove(+id, user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@AuthUser() user: User, @Param('id') id: string) {
    return this.wishesService.copyWish(+id, user.id);
  }

  @Get('last')
  getLast() {
    return this.wishesService.getLast();
  }

  @Get('top')
  getTopCopied() {
    return this.wishesService.getTopCopied();
  }

  // @Get()
  // findAll() {
  //   return this.wishesService.findAll();
  // }
}
