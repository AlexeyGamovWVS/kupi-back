import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto) {
    // использованы транзакции тк выполняются операции
    // по изменению разных сущностей (желание, оффер)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishesService.findOne(createOfferDto.itemId);
      if (!wish) {
        throw new NotFoundException('Не найдено желание');
      }
      if (wish.owner.id === userId) {
        throw new BadRequestException(
          'Пользователю нельзя вносить деньги на собственные подарки, а также удалять или редактировать заявки',
        );
      }
      if (+createOfferDto.amount <= 0) {
        throw new BadRequestException(
          'Сумма не может быть равна нулю или меньше 0.',
        );
      }
      const raised =
        wish.offers
          .map((offer) => offer.raised)
          .reduce((acc, curr) => +acc + +curr, 0) + +createOfferDto.amount;

      if (raised > wish.price) {
        throw new ConflictException(
          'Сумма собранных средств не может превышать стоимость подарка.',
        );
      }
      wish.raised = raised;
      await this.wishesService.save(wish);

      const user = await this.usersService.findById(userId);

      const offer = this.offerRepository.create({
        ...createOfferDto,
        raised: createOfferDto.amount,
        user: user,
        item: wish,
      });

      const savedOffer = await this.offerRepository.save(offer);
      await queryRunner.commitTransaction();
      return savedOffer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.offerRepository.find({
      relations: {
        item: { offers: true, owner: true },
        user: {
          offers: { item: true },
          wishes: { offers: true, owner: true },
          wishlist: true,
        },
      },
    });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: {
        item: { offers: true, owner: true },
        user: {
          offers: { item: true },
          wishes: { offers: true, owner: true },
          wishlist: true,
        },
      },
    });
  }

  // async update(id: number, updateOfferDto: UpdateOfferDto) {
  //   const offer = await this.findOne(id);
  //   if (!offer) {
  //     throw new NotFoundException('Предложение не найдено');
  //   }
  //   return this.offerRepository.update({ id }, updateOfferDto);
  // }

  // async remove(id: number) {
  //   const offer = await this.findOne(id);
  //   if (!offer) {
  //     throw new NotFoundException('Предложение не найдено');
  //   }
  //   return this.offerRepository.delete(id);
  // }
}
