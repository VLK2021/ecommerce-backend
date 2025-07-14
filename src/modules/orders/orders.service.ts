import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Parser } from 'json2csv';
import { Prisma, OrderStatus } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    try {
      const { items, paymentType, ...orderData } = dto;
      let totalPrice = orderData.totalPrice;

      if (!totalPrice && items?.length) {
        totalPrice = items.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0,
        );
      }

      // Перевірка залишків
      const stocks = await this.prisma.productStock.findMany({
        where: {
          OR: items.map((item) => ({
            productId: item.productId,
            warehouseId: item.warehouseId,
          })),
        },
        select: {
          productId: true,
          warehouseId: true,
          quantity: true,
          product: { select: { name: true } },
        },
      });

      const insufficient: {
        productId: string;
        productName: string;
        requested: number;
        available: number;
      }[] = [];

      for (const item of items) {
        const found = stocks.find(
          (s) =>
            s.productId === item.productId &&
            s.warehouseId === item.warehouseId,
        );
        if (!found || found.quantity < item.quantity) {
          insufficient.push({
            productId: item.productId,
            productName: found?.product.name || item.productName || '',
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

      return await this.prisma.$transaction(async (tx) => {
        const lastOrder = await tx.order.findFirst({
          orderBy: { orderNumber: 'desc' },
          select: { orderNumber: true },
        });
        const nextOrderNumber = (lastOrder?.orderNumber || 0) + 1;

        const itemsData = items.map((item) => ({
          quantity: item.quantity,
          price: new Prisma.Decimal(item.price),
          productName: item.productName,
          productCategoryId: item.productCategoryId ?? null,
          productCategoryName: item.productCategoryName ?? null,
          isActive: item.isActive ?? null,
          productId: item.productId,
          warehouseId: item.warehouseId,
        }));

        const createdOrder = await tx.order.create({
          data: {
            ...orderData,
            orderNumber: nextOrderNumber,
            totalPrice: totalPrice ? new Prisma.Decimal(totalPrice) : null,
            items: { create: itemsData },
            paymentType: paymentType ?? null,
            ...(orderData.userId ? { userId: orderData.userId } : {}),
          },
          include: {
            items: { include: { product: true, warehouse: true } },
            warehouse: true,
            user: true,
            payment: true,
            statusHistory: true,
          },
        });

        for (const item of items) {
          await tx.productStock.updateMany({
            where: {
              productId: item.productId,
              warehouseId: item.warehouseId,
            },
            data: {
              quantity: { decrement: item.quantity },
            },
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

  async findAll(query: FilterOrdersDto) {
    const {
      userId,
      warehouseId,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const where: Prisma.OrderWhereInput = {};
    if (userId) where.userId = userId;
    if (warehouseId) where.warehouseId = warehouseId;
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
      include: {
        items: { include: { product: true, warehouse: true } },
        warehouse: true,
        user: true,
        payment: true,
        statusHistory: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items: orders, total, page, limit };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, warehouse: true } },
        warehouse: true,
        user: true,
        payment: true,
        statusHistory: true,
      },
    });
    if (!order) throw new NotFoundException('Замовлення не знайдено');
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true, warehouse: true } },
        warehouse: true,
        user: true,
        payment: true,
        statusHistory: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

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
      include: {
        items: { include: { product: true, warehouse: true } },
        warehouse: true,
        user: true,
        payment: true,
        statusHistory: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    const existingOrder = await this.findOne(id);

    // Повертаємо залишки зі старих товарів
    for (const oldItem of existingOrder.items) {
      await this.prisma.productStock.updateMany({
        where: {
          productId: oldItem.productId,
          warehouseId: oldItem.warehouseId,
        },
        data: {
          quantity: { increment: oldItem.quantity },
        },
      });
    }

    // Видаляємо старі товари
    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });

    // Формуємо нові товари
    const itemsData = (dto.items || []).map((item) => ({
      quantity: item.quantity,
      price: new Prisma.Decimal(Number(item.price)),
      productName: item.productName,
      productCategoryId: item.productCategoryId ?? null,
      productCategoryName: item.productCategoryName ?? null,
      isActive: item.isActive ?? null,
      productId: item.productId,
      warehouseId: item.warehouseId,
    }));

    const data: Prisma.OrderUpdateInput = {
      ...(dto.status && { status: dto.status as OrderStatus }),
      ...(dto.deliveryType && { deliveryType: dto.deliveryType }),
      ...(dto.deliveryData && { deliveryData: dto.deliveryData }),
      ...(dto.comment && { comment: dto.comment }),
      ...(dto.paymentType && { paymentType: dto.paymentType }),
      ...(dto.customerName && { customerName: dto.customerName }),
      ...(dto.customerPhone && { customerPhone: dto.customerPhone }),
      ...(dto.customerEmail && { customerEmail: dto.customerEmail }),
      ...(dto.totalPrice !== undefined && {
        totalPrice: new Prisma.Decimal(Number(dto.totalPrice)),
      }),
      ...(dto.userId && { user: { connect: { id: dto.userId } } }),
      ...(dto.warehouseId && {
        warehouse: { connect: { id: dto.warehouseId } },
      }),
      items: { create: itemsData },
    };

    // Віднімаємо залишки для нових товарів
    for (const item of dto.items || []) {
      await this.prisma.productStock.updateMany({
        where: {
          productId: item.productId,
          warehouseId: item.warehouseId,
        },
        data: {
          quantity: { decrement: item.quantity },
        },
      });
    }

    // Оновлюємо ордер
    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        items: { include: { product: true, warehouse: true } },
        warehouse: true,
        user: true,
        payment: true,
        statusHistory: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findOne(id);

    if (
      (status === 'CANCELLED' || status === 'RETURNED') &&
      order.status !== status
    ) {
      for (const item of order.items) {
        await this.prisma.productStock.updateMany({
          where: {
            productId: item.productId,
            warehouseId: item.warehouseId,
          },
          data: { quantity: { increment: item.quantity } },
        });
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: {
        items: { include: { product: true, warehouse: true } },
        warehouse: true,
        user: true,
        payment: true,
        statusHistory: true,
      },
    });
  }

  async addComment(id: string, comment: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { comment },
      include: {
        items: { include: { product: true, warehouse: true } },
        warehouse: true,
        user: true,
        payment: true,
        statusHistory: true,
      },
    });
  }

  async statusHistory(id: string) {
    return this.prisma.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async exportOrders(query: FilterOrdersDto) {
    const { items } = await this.findAll(query);
    const parser = new Parser();
    return parser.parse(items);
  }

  async repeatOrder(id: string) {
    const prevOrder = await this.findOne(id);
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
      warehouseId: prevOrder.warehouseId,
      paymentType: prevOrder.paymentType ?? undefined, // --- тут
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        productName: item.productName,
        productCategoryId: item.productCategoryId ?? undefined,
        productCategoryName: item.productCategoryName ?? undefined,
        isActive: item.isActive ?? undefined,
        warehouseId: item.warehouseId,
      })),
    });
  }

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

  async invoice(id: string) {
    const order = await this.findOne(id);
    return `<h1>Інвойс для замовлення ${order.id}</h1>`;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}
