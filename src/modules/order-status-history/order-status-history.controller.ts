import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { OrderStatusHistoryService } from './order-status-history.service';
import { CreateOrderStatusInput } from './dto/create-order-status.input';
import { FilterOrderStatusInput } from './dto/filter-order-status.input';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { OrderStatusOutput } from './dto/order-status.output';

@ApiTags('Order Status History')
@Controller('order-status-history')
export class OrderStatusHistoryController {
  constructor(private readonly service: OrderStatusHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Додати новий статус до замовлення' })
  @ApiResponse({ type: OrderStatusOutput })
  create(@Body() dto: CreateOrderStatusInput) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі історії статусів (фільтр/пагінація)' })
  @ApiResponse({ type: [OrderStatusOutput] })
  async findAll(@Query() query: FilterOrderStatusInput) {
    const res = await this.service.findAll(query);
    return res.items;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати статус за ID' })
  @ApiResponse({ type: OrderStatusOutput })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Вся історія статусів по orderId' })
  @ApiResponse({ type: [OrderStatusOutput] })
  @ApiParam({ name: 'orderId', description: 'ID замовлення' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(orderId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Редагувати коментар до статусу' })
  @ApiResponse({ type: OrderStatusOutput })
  updateComment(@Param('id') id: string, @Body() dto: { comment?: string }) {
    return this.service.updateComment(id, dto.comment);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити запис історії статусу' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
