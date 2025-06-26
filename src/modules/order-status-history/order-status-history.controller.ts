import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrderStatusHistoryService } from './order-status-history.service';
import { CreateOrderStatusInput } from './dto/create-order-status.input';
import { FilterOrderStatusInput } from './dto/filter-order-status.input';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { OrderStatusOutput } from './dto/order-status.output';

@ApiTags('Order Status History')
@Controller('order-status-history')
export class OrderStatusHistoryController {
  constructor(private readonly service: OrderStatusHistoryService) {}

  @Post()
  @ApiResponse({ type: OrderStatusOutput })
  create(@Body() dto: CreateOrderStatusInput) {
    return this.service.create(dto);
  }

  @Get()
  @ApiResponse({ type: [OrderStatusOutput] })
  async findAll(@Query() query: FilterOrderStatusInput) {
    // Повертаємо тільки items — для swagger наглядності!
    const res = await this.service.findAll(query);
    return res.items;
  }

  @Get(':id')
  @ApiResponse({ type: OrderStatusOutput })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
