import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @ApiOperation({ summary: 'Створити склад' })
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehousesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі склади з фільтрацією та сортуванням' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAll(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: 'name',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.warehousesService.findAll({
      search,
      sortBy,
      sortOrder,
      limit: limit ? +limit : undefined,
      page: page ? +page : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати склад по ID' })
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити склад' })
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.warehousesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити склад' })
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
