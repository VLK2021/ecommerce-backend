import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { Prisma, OrderStatus, Order, OrderItem } from '@prisma/client';
import { Parser } from 'json2csv';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Створення замовлення з перевіркою залишків і детальною відповіддю
  async create(dto: CreateOrderDto): Promise<Order & { items: OrderItem[] }> {
    try {
      const { items, ...orderData } = dto;
      let totalPrice = orderData.totalPrice;
      if (!totalPrice && items?.length) {
        totalPrice = items.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0,
        );
      }

      // --- Перевірка залишків перед транзакцією ---
      const insufficient: {
        productId: string;
        productName?: string;
        requested: number;
        available: number;
      }[] = [];

      const productIds = items.map((item) => item.productId);
      const stocks = await this.prisma.productStock.findMany({
        where: {
          productId: { in: productIds },
        },
        select: {
          productId: true,
          quantity: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      });

      for (const item of items) {
        const found = stocks.find((s) => s.productId === item.productId);
        if (!found || found.quantity < item.quantity) {
          insufficient.push({
            productId: item.productId,
            productName: found?.product?.name || item.productName || '',
            requested: item.quantity,
            available: found?.quantity ?? 0,
          });
        }
      }

      if (insufficient.length) {
        throw new BadRequestException({
          message: 'Недостатньо товару для деяких позицій',
          insufficient,
        });
      }

      // --- Якщо всі ок, створюємо замовлення і списуємо ---
      return await this.prisma.$transaction(async (tx) => {
        // Виправлення! НЕ треба дублювати productId як поле, тільки product: { connect: { id } }
        const itemsData: Prisma.OrderItemCreateWithoutOrderInput[] = items.map(
          (item) => ({
            quantity: item.quantity,
            price: new Prisma.Decimal(Number(item.price)),
            productName: item.productName,
            productCategoryId: item.productCategoryId ?? null,
            productCategoryName: item.productCategoryName ?? null,
            isActive: item.isActive ?? null,
            product: { connect: { id: item.productId } },
          }),
        );

        const createdOrder = await tx.order.create({
          data: {
            ...orderData,
            userId: orderData.userId ?? undefined,
            totalPrice: totalPrice
              ? new Prisma.Decimal(Number(totalPrice))
              : null,
            items: { create: itemsData },
          },
          include: { items: true },
        });

        // Списуємо залишки
        for (const item of items) {
          await tx.productStock.updateMany({
            where: { productId: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }

        return createdOrder;
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Не вдалося створити замовлення');
    }
  }

  // Повертає всі замовлення з фільтрами
  async findAll(query: FilterOrdersDto) {
    const {
      userId,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;
    const where: Prisma.OrderWhereInput = {};
    if (userId) where.userId = userId;
    if (status) where.status = status as OrderStatus;
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    const total = await this.prisma.order.count({ where });
    const orders = await this.prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items: orders, total, page, limit };
  }

  // Пошук по тексту
  async search(query: string) {
    return this.prisma.order.findMany({
      where: {
        OR: [
          { customerName: { contains: query, mode: 'insensitive' } },
          { customerPhone: { contains: query, mode: 'insensitive' } },
          { customerEmail: { contains: query, mode: 'insensitive' } },
          { id: { contains: query } },
        ],
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Повертає замовлення певного користувача
  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Деталі замовлення
  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Замовлення не знайдено');
    return order;
  }

  // Оновити замовлення
  async update(id: string, dto: UpdateOrderDto) {
    await this.findOne(id);
    const data: Prisma.OrderUpdateInput = {};
    if (dto.status) data.status = dto.status as OrderStatus;
    if (dto.deliveryType) data.deliveryType = dto.deliveryType;
    if (dto.deliveryData) data.deliveryData = dto.deliveryData;
    if (dto.comment) data.comment = dto.comment;
    return this.prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });
  }

  // Оновити тільки статус
  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { items: true },
    });
  }

  // Додати/оновити коментар
  async addComment(id: string, comment: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { comment },
      include: { items: true },
    });
  }

  // Повертає історію статусів замовлення (OrderStatusHistory)
  async statusHistory(id: string) {
    return this.prisma.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Експорт замовлень
  async exportOrders(query: FilterOrdersDto) {
    const { items } = await this.findAll(query);
    const parser = new Parser();
    return parser.parse(items);
  }

  // Повторити замовлення
  async repeatOrder(id: string) {
    const prevOrder = await this.findOne(id);
    if (!prevOrder) throw new NotFoundException('Замовлення не знайдено');
    const { items } = prevOrder;
    return this.create({
      userId: prevOrder.userId ?? undefined,
      customerName: prevOrder.customerName ?? undefined,
      customerPhone: prevOrder.customerPhone ?? undefined,
      customerEmail: prevOrder.customerEmail ?? undefined,
      deliveryType: prevOrder.deliveryType ?? undefined,
      deliveryData:
        typeof prevOrder.deliveryData === 'object' &&
        prevOrder.deliveryData !== null &&
        !Array.isArray(prevOrder.deliveryData)
          ? prevOrder.deliveryData
          : undefined,
      comment: prevOrder.comment ?? undefined,
      totalPrice: prevOrder.totalPrice
        ? Number(prevOrder.totalPrice)
        : undefined,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        productName: item.productName,
        productCategoryId: item.productCategoryId ?? undefined,
        productCategoryName: item.productCategoryName ?? undefined,
        isActive: item.isActive ?? undefined,
      })),
    });
  }

  // Загальна статистика
  async getStats() {
    const total = await this.prisma.order.count();
    const totalPrice = await this.prisma.order.aggregate({
      _sum: { totalPrice: true },
    });
    const byStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
      _sum: { totalPrice: true },
    });
    return {
      totalOrders: total,
      totalSum: totalPrice._sum.totalPrice ?? 0,
      byStatus,
    };
  }

  // Інвойс (HTML)
  async invoice(id: string) {
    const order = await this.findOne(id);
    return `<h1>Інвойс для замовлення ${order.id}</h1>`;
  }

  // Видалити замовлення
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}
