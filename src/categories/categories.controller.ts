import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './services/categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Створити нову категорію' })
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      example1: {
        summary: 'Приклад категорії: електроніка',
        value: { name: 'Електроніка' },
      },
      example2: {
        summary: 'Приклад категорії: одяг',
        value: { name: 'Одяг' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Категорія успішно створена',
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі категорії' })
  @ApiResponse({
    status: 200,
    description: 'Повертає масив усіх доступних категорій',
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати категорію по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID категорії, яку потрібно знайти',
    example: '5a9dbecc-1234-4567-89ab-abcde1234567',
  })
  @ApiResponse({
    status: 200,
    description: 'Повертає одну категорію',
  })
  @ApiResponse({
    status: 404,
    description: 'Категорію з таким ID не знайдено',
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити категорію по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID категорії для видалення',
    example: '5a9dbecc-1234-4567-89ab-abcde1234567',
  })
  @ApiResponse({
    status: 200,
    description: 'Категорія успішно видалена',
  })
  @ApiResponse({
    status: 404,
    description: 'Категорія не знайдена',
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
