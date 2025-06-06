import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AssignAttributeDto } from './dto/assign-attribute.dto';
import { AttributeResponseDto } from './dto/attribute-response.dto';

@ApiTags('Attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  @ApiOperation({ summary: 'Створити новий атрибут' })
  @ApiBody({ type: CreateAttributeDto })
  @ApiResponse({
    status: 201,
    description: 'Атрибут створено',
    type: AttributeResponseDto,
  })
  create(@Body() dto: CreateAttributeDto) {
    return this.attributesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі атрибути' })
  @ApiResponse({
    status: 200,
    description: 'Масив усіх атрибутів',
    type: [AttributeResponseDto],
  })
  getAll() {
    return this.attributesService.getAll();
  }

  @Post('assign')
  @ApiOperation({ summary: 'Привʼязати атрибут до категорії' })
  @ApiBody({ type: AssignAttributeDto })
  @ApiResponse({ status: 201, description: 'Атрибут привʼязано до категорії' })
  assign(@Body() dto: AssignAttributeDto) {
    return this.attributesService.assignToCategory(dto);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Отримати атрибути по категорії' })
  @ApiParam({
    name: 'categoryId',
    example: 'uuid',
    description: 'ID категорії',
  })
  @ApiResponse({
    status: 200,
    description: 'Список атрибутів для категорії',
    type: [AttributeResponseDto],
  })
  getByCategory(@Param('categoryId') categoryId: string) {
    return this.attributesService.getAllByCategory(categoryId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити атрибут за ID' })
  @ApiParam({ name: 'id', example: 'uuid' })
  @ApiBody({ type: UpdateAttributeDto })
  @ApiResponse({
    status: 200,
    description: 'Атрибут оновлено успішно',
    type: AttributeResponseDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateAttributeDto) {
    return this.attributesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити атрибут за ID' })
  @ApiParam({ name: 'id', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Атрибут успішно видалено' })
  delete(@Param('id') id: string) {
    return this.attributesService.delete(id);
  }
}
