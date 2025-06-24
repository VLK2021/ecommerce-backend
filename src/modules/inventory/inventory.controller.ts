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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { FilterInventoryDto } from '../warehouses/dto/filter-inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Додати товар на склад' })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі записи товарів на складах' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати запис за ID' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Get('/warehouse/:warehouseId')
  @ApiOperation({
    summary: 'Залишки по конкретному складу (фільтрація/сортування)',
  })
  findByWarehouseId(
    @Param('warehouseId') warehouseId: string,
    @Query() query: FilterInventoryDto, // DTO з усіма optional
  ) {
    return this.inventoryService.findByWarehouseId(warehouseId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити склад' })
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити запис' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
