import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // add new user
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        username: createUserDto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email или username уже используются');
    }
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      password: hashedPassword,
      ...rest,
    });
    return this.userRepository.save(user);
  }

  // Return all users
  findAll() {
    return this.userRepository.find();
  }

  // Return user by ID
  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  // update
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    // проверяем что обновляем и сокращаем запрос в БД
    if (updateUserDto.username && updateUserDto.username === user.username) {
      delete updateUserDto.username;
    }
    if (updateUserDto.email && updateUserDto.email === user.email) {
      delete updateUserDto.email;
    }
    if (updateUserDto.about && updateUserDto.about === user.about) {
      delete updateUserDto.about;
    }
    if (updateUserDto.avatar && updateUserDto.avatar === user.avatar) {
      delete updateUserDto.avatar;
    }
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      await bcrypt.compare(hashedPassword, user.password).then((matched) => {
        if (matched) {
          delete updateUserDto.password;
        } else {
          updateUserDto.password = hashedPassword;
        }
      });
    }

    try {
      if (!updateUserDto) {
        throw new ConflictException('Нечего обновлять');
      }
      await this.userRepository.update(id, updateUserDto);
      return this.findOne(id);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Произошла ошибка при обновлении пользователя',
      );
    }
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
