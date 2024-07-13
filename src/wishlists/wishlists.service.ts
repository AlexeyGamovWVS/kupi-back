import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    if (!Array.isArray(createWishlistDto.itemsId)) {
      throw new BadRequestException('itemsIds should be an array');
    }
    const owner = await this.userService.findById(userId);
    const wishes = await this.wishRepository.find({
      where: { id: In(createWishlistDto.itemsId) },
    });
    const newWishList = this.wishlistRepository.create({
      ...createWishlistDto,
      owner,
      items: wishes,
    });
    return this.wishlistRepository.save(newWishList);
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    return wishlist;
  }

  async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    if (wishlist.owner.id !== userId) {
      throw new UnauthorizedException(
        'Нельзя изменять или удалять чужой список желаний',
      );
    }

    const newWishes = await this.wishRepository.find({
      where: { id: In(updateWishlistDto.itemsId) },
    });
    const { name, image, description } = updateWishlistDto;
    // const owner = await this.userService.findById(userId);
    return this.wishlistRepository.save({
      ...wishlist,
      name,
      image,
      description,
      items: newWishes,
    });
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    if (wishlist.owner.id !== userId) {
      throw new UnauthorizedException(
        'Нельзя изменять или удалять чужой список желаний',
      );
    }
    return this.wishlistRepository.delete(id);
  }

  // default
  findAll() {
    return this.wishlistRepository.find({
      relations: { owner: true, items: true },
    });
  }
}
