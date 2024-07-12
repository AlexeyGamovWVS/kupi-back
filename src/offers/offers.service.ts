import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
    });

    if (!wish) {
      throw new NotFoundException('Не найдено желание');
    }
    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Пользователю нельзя вносить деньги на собственные подарки, а также удалять или редактировать заявки',
      );
    }

    wish.raised = wish.offers
      .map((offer) => offer.raised)
      .reduce((acc, count) => acc + count, 0);

    if (wish.raised > wish.price) {
      throw new ConflictException(
        'Сумма собранных средств не может превышать стоимость подарка.',
      );
    }

    this.wishRepository.update({ id: wish.id }, wish);
    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });
    return this.offerRepository.save(offer);
  }

  findAll() {
    return this.offerRepository.find();
  }

  findOne(id: number) {
    return this.offerRepository.findOneBy({ id });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    const offer = await this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }
    return this.offerRepository.update({ id }, updateOfferDto);
  }

  async remove(id: number) {
    const offer = await this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }
    return this.offerRepository.delete(id);
  }
}
