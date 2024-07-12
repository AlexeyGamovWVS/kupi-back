import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Req() req): { access_token: string } {
    return this.authService.signin(req.user);
  }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
