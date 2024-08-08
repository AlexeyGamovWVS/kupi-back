import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@AuthUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(user.id, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
  //   return this.offersService.update(+id, updateOfferDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.offersService.remove(+id);
  // }
}
