import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeRoles } from 'src/common/enums/rol.enum';

@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}
  @Auth(TypeRoles.ADMIN)
  @Post()
  create(@Body() createBreedDto: CreateBreedDto) {
    return this.breedsService.create(createBreedDto);
  }

  @Get()
  findAll() {
    return this.breedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.breedsService.findOne(id);
  }

  /*  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBreedDto: UpdateBreedDto) {
    return this.breedsService.update(+id, updateBreedDto);
  } */

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.breedsService.remove(id);
  }
}
