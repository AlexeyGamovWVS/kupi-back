import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
// import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, createWishDto: CreateWishDto) {
    const owner = await this.userService.findById(userId);
    const wish = this.wishRepository.create({ ...createWishDto, owner: owner });
    return this.wishRepository.save(wish);
  }

  findAll() {
    return this.wishRepository.find();
  }

  findOne(id: number) {
    return this.wishRepository.findOneBy({ id });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (wish.owner.id !== userId) {
      throw new UnauthorizedException(
        'Нельзя изменять или удалять чужие подарки',
      );
    }
    if (updateWishDto && wish.raised > 0) {
      throw new ConflictException(
        'Нельзя изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return this.wishRepository.update({ id }, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (wish.owner.id !== userId) {
      throw new UnauthorizedException(
        'Нельзя изменять или удалять чужие подарки',
      );
    }
    return this.wishRepository.delete(id);
  }

  async findWishesByUserId(ownerId: number) {
    const wishes = await this.wishRepository.find({
      where: { owner: { id: ownerId } },
    });
    if (!wishes) {
      throw new NotFoundException('Желаемые подарки не найдены');
    }
    return wishes;
  }

  async findWishesByUserName(username: string) {
    const wishes = await this.wishRepository.find({
      where: { owner: { username: username } },
    });
    if (!wishes) {
      throw new NotFoundException('Желаемые подарки не найдены');
    }
    return wishes;
  }
}
