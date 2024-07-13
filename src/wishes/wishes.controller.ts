import {
  Controller,
  // Get,
  Post,
  Body,
  UseGuards,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';

import { JwtGuard } from 'src/auth/guard/jwt.guard';
// import { UpdateWishDto } from './dto/update-wish.dto';

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

  // @Get()
  // findAll() {
  //   return this.wishesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.wishesService.findOne(+id);
  // }

  // @UseGuards(JwtGuard)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
  //   return this.wishesService.update(+id, updateWishDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wishesService.remove(+id);
  // }
}
