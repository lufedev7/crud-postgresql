import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from 'src/common/interface/user-active.interface';
import { TypeRoles } from '../common/enums/rol.enum';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,
  ) {}
  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    const { ...rest } = createCatDto;
    const breed = await this.validateBreed(createCatDto.breed);
    const cat = this.catRepository.create({
      ...rest,
      breed,
      userEmail: user.email,
    });
    return this.catRepository.save(cat);
  }

  async findAll(user: UserActiveInterface) {
    if (user.role === TypeRoles.ADMIN) {
      return await this.catRepository.find();
    }
    return await this.catRepository.find({ where: { userEmail: user.email } });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new BadRequestException('Cat not found');
    }
    this.validateOwnerShip(cat, user);
    return cat;
  }

  async update(
    id: number,
    updateCatDto: UpdateCatDto,
    user: UserActiveInterface,
  ) {
    await this.findOne(id, user);

    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed
        ? await this.validateBreed(updateCatDto.breed)
        : undefined,
      userEmail: user.email,
    });
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.catRepository.softDelete(id);
  }
  private validateOwnerShip(cat: Cat, user: UserActiveInterface) {
    if (user.role !== TypeRoles.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException('User not autorized');
    }
  }
  private async validateBreed(breedId: number) {
    const breedFound = await this.breedsRepository.findOneBy({
      id: breedId,
    });
    if (!breedFound) {
      throw new BadRequestException('Breed not found');
    }
    return breedFound;
  }
}
