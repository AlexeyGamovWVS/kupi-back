import {
  BadRequestException,
  ConflictException,
  Injectable,
  // InternalServerErrorException,
  // NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { FindUserDto } from './dto/find-user.dto';
import { hashValue } from 'src/common/helpers/hash';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async checkUserExist(
    email: string,
    username: string,
    userId?: number,
  ) {
    let existingUser: User = undefined;

    if (email) {
      existingUser = await this.findOneByEmail(email);
    }

    if (username && !existingUser) {
      existingUser = await this.findOneByUsername(username);
    }

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException(
        'Email или имя пользователя уже используются',
      );
    }
  }

  async singup(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUserExist(createUserDto.email, createUserDto.username);
    const { password } = createUserDto;
    const user = this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.userRepository.save(user);
  }

  // для внутреннего использования
  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(query);
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    await this.checkUserExist(
      updateUserDto.email,
      updateUserDto.username,
      userId,
    );
    const { password } = updateUserDto;
    const user = await this.findById(userId);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findMany(findUserDto: FindUserDto) {
    const { email, username } = findUserDto;
    if (!email && !username) {
      throw new BadRequestException('Ошибка в запросе поиска пользователя');
    }
    if (email && username) {
      return this.userRepository.find({
        where: { username: username, email: email },
      });
    }
    if (email) {
      return this.userRepository.findBy({ email });
    }
    if (!email) {
      return this.userRepository.findBy({ username });
    }
  }

  // // Return all users
  // findAll() {
  //   return this.userRepository.find();
  // }

  // // Return user by ID
  // findOne(id: number) {
  //   return this.userRepository.findOneBy({ id });
  // }

  // remove(id: number) {
  //   return this.userRepository.delete(id);
  // }
}
