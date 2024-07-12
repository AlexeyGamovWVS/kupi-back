import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishRepository.find({
      where: {
        id: In(createWishlistDto.items),
      },
    });
    const newWishList = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return this.wishlistRepository.save(newWishList);
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOneBy({ id });
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    return wishlist;
  }

  async update(id: number, user: User, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    if (wishlist.owner.id !== user.id) {
      throw new UnauthorizedException(
        'Нельзя изменять или удалять чужой список желаний',
      );
    }
    const newWishes = await this.wishRepository.find({
      where: {
        id: In(updateWishlistDto.items),
      },
    });

    return this.wishlistRepository.update(
      { id },
      { ...updateWishlistDto, owner: user, items: newWishes },
    );
  }

  async remove(id: number, user: User) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    if (wishlist.owner.id !== user.id) {
      throw new UnauthorizedException(
        'Нельзя изменять или удалять чужой список желаний',
      );
    }
    return this.wishlistRepository.delete(id);
  }
}
