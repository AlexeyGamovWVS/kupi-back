import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  // Delete,
  // UseGuards,
  // Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async getMe(@AuthUser() user: User): Promise<User> {
    return await this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('me')
  async updateMe(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Get('me/wishes')
  async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.wishesService.findWishesByUserId(user.id);
  }

  @Get(':username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Get(':username/wishes')
  findSomeOneWishes(@Param('username') username: string) {
    return this.wishesService.findWishesByUserName(username);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }
  /*
  // deafult

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  */
}
