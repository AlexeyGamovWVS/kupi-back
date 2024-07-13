import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guard/local.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@AuthUser() user: User) {
    return this.authService.signin(user);
  }

  @Post('signup')
  async signuo(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.singup(createUserDto);
  }
}
