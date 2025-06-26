import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderStatusInput } from './dto/create-order-status.input';
import { FilterOrderStatusInput } from './dto/filter-order-status.input';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderStatusHistoryService {
  constructor(private prisma: PrismaService) {}

  // Додати новий статус
  async create(dto: CreateOrderStatusInput) {
    return this.prisma.orderStatusHistory.create({
      data: {
        orderId: dto.orderId,
        status: dto.status,
        comment: dto.comment,
      },
    });
  }

  // Отримати всі з фільтрацією
  async findAll(query: FilterOrderStatusInput) {
    const { orderId, status, page = 1, limit = 20 } = query;
    const where: {
      orderId?: string;
      status?: OrderStatus;
    } = {};
    if (orderId) where.orderId = orderId;
    if (status) where.status = status;

    const total = await this.prisma.orderStatusHistory.count({ where });
    const items = await this.prisma.orderStatusHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  // По id
  async findOne(id: string) {
    const item = await this.prisma.orderStatusHistory.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Статус не знайдено');
    return item;
  }

  // Вся історія по замовленню
  async findByOrder(orderId: string) {
    return this.prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Оновити коментар
  async updateComment(id: string, comment?: string) {
    await this.findOne(id); // Якщо не знайде — кине NotFoundException
    return this.prisma.orderStatusHistory.update({
      where: { id },
      data: { comment },
    });
  }

  // Видалити статус
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.orderStatusHistory.delete({ where: { id } });
  }
}
