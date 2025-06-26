import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { Prisma, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Створення нового замовлення
  async create(dto: CreateOrderDto) {
    try {
      const { items, ...orderData } = dto;

      // Розрахунок загальної суми якщо не передано
      let totalPrice = orderData.totalPrice;
      if (!totalPrice && items?.length) {
        totalPrice = items.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0,
        );
      }

      const itemsData = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
        productCategoryId: item.productCategoryId,
        productCategoryName: item.productCategoryName,
        isActive: item.isActive,
      }));

      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          totalPrice,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    } catch (error) {
      console.error('Order create error:', error);
      throw new InternalServerErrorException('Не вдалося створити замовлення');
    }
  }

  // Список усіх замовлень (з фільтрацією)
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

    return {
      items: orders,
      total,
      page,
      limit,
    };
  }

  // Знайти одне замовлення по id
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

    // Типізація, щоб не було помилок з enum
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

  // Видалити замовлення
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}
