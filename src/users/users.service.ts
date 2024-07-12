import {
  BadRequestException,
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
import { WishesService } from 'src/wishes/wishes.service';
import { FindUserDto } from './dto/find-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private wishesService: WishesService,
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

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
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

  async findMyWishes(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return this.wishesService.findWishesByUserId(id);
  }

  async findSomeOneWishes(username: string) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return this.wishesService.findWishesByUserId(user.id);
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
}
