import { Module } from '@nestjs/common';
import { OrderStatusHistoryService } from './order-status-history.service';
import { OrderStatusHistoryController } from './order-status-history.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [OrderStatusHistoryController],
  providers: [OrderStatusHistoryService, PrismaService],
})
export class OrderStatusHistoryModule {}
