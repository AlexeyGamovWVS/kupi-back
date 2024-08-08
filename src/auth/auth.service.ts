import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { hashCompare } from 'src/common/helpers/hash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });
    if (user && (await hashCompare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(user: User) {
    const { username, id: sub } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }
}
