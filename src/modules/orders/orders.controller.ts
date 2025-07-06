import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { OrderOutputDto } from './dto/order.output';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🟩 Створити нове замовлення
  @Post()
  @ApiOperation({ summary: 'Створити нове замовлення' })
  @ApiResponse({ status: 201, type: OrderOutputDto })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  // 🟦 Список замовлень з фільтрацією/пагінацією
  @Get()
  @ApiOperation({ summary: 'Список замовлень з фільтрацією/пагінацією' })
  findAll(@Query() query: FilterOrdersDto) {
    return this.ordersService.findAll(query);
  }

  // 🟦 Список замовлень користувача
  @Get('user/:userId')
  @ApiOperation({ summary: 'Список замовлень користувача' })
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }

  // 🟦 Пошук замовлень
  @Get('search')
  @ApiOperation({ summary: 'Пошук замовлень' })
  search(@Query('query') query: string) {
    return this.ordersService.search(query);
  }

  // 🟦 Деталі замовлення
  @Get(':id')
  @ApiOperation({ summary: 'Деталі замовлення' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // 🟧 Оновити замовлення
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити замовлення' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  // 🟧 Оновити лише статус
  @Patch(':id/status')
  @ApiOperation({ summary: 'Оновити лише статус замовлення' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  // 🟧 Додати/оновити коментар
  @Post(':id/comment')
  @ApiOperation({ summary: 'Додати або оновити коментар' })
  addComment(@Param('id') id: string, @Body('comment') comment: string) {
    return this.ordersService.addComment(id, comment);
  }

  // 🟦 Історія статусів (mock/demo)
  @Get(':id/status-history')
  @ApiOperation({ summary: 'Історія статусів по замовленню' })
  statusHistory(@Param('id') id: string) {
    return this.ordersService.statusHistory(id);
  }

  // 🟦 Експорт замовлень
  @Get('export')
  @ApiOperation({ summary: 'Експорт замовлень (CSV)' })
  async export(@Query() query: FilterOrdersDto) {
    return this.ordersService.exportOrders(query);
  }

  // 🟧 Повторити замовлення
  @Post(':id/repeat')
  @ApiOperation({ summary: 'Повторити замовлення' })
  repeat(@Param('id') id: string) {
    return this.ordersService.repeatOrder(id);
  }

  // 🟦 Статистика
  @Get('stats/general')
  @ApiOperation({ summary: 'Загальна статистика по замовленнях' })
  stats() {
    return this.ordersService.getStats();
  }

  // 🟦 Інвойс (mock/demo)
  @Get(':id/invoice')
  @ApiOperation({ summary: 'Згенерувати інвойс (PDF/HTML)' })
  invoice(@Param('id') id: string) {
    return this.ordersService.invoice(id);
  }

  // 🟥 Видалити замовлення
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити замовлення' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
