import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentStatusInput } from './dto/update-payment-status.input';
import { RefundPaymentInput } from './dto/refund-payment.input';
import { FilterPaymentsInput } from './dto/filter-payments.input';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PaymentOutput } from './dto/payment.output';
import { PaymentStatsOutput } from './dto/payment-stats.output';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити новий платіж' })
  @ApiResponse({ type: PaymentOutput })
  create(@Body() dto: CreatePaymentInput) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Оновити статус платежу' })
  @ApiResponse({ type: PaymentOutput })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusInput) {
    return this.paymentsService.updateStatus(id, dto);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Оформити повернення по платежу' })
  @ApiResponse({ type: PaymentOutput })
  refund(@Param('id') id: string, @Body() dto: RefundPaymentInput) {
    return this.paymentsService.refund(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список платежів (з фільтрацією/пагінацією)' })
  @ApiResponse({ type: [PaymentOutput] })
  findAll(@Query() query: FilterPaymentsInput) {
    return this.paymentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі платежу' })
  @ApiResponse({ type: PaymentOutput })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Платежі по замовленню' })
  @ApiResponse({ type: [PaymentOutput] })
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  @Get('stats/general')
  @ApiOperation({ summary: 'Загальна статистика по платежах' })
  @ApiResponse({ type: PaymentStatsOutput })
  getStats() {
    return this.paymentsService.getStats();
  }
}
