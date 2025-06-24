import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { FilterInventoryDto } from '../warehouses/dto/filter-inventory.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInventoryDto) {
    const existing = await this.prisma.productStock.findUnique({
      where: {
        productId_warehouseId: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
        },
      },
    });

    if (existing) {
      return this.prisma.productStock.update({
        where: {
          productId_warehouseId: {
            productId: dto.productId,
            warehouseId: dto.warehouseId,
          },
        },
        data: {
          quantity: existing.quantity + dto.quantity,
        },
      });
    }

    return this.prisma.productStock.create({ data: dto });
  }

  async findAll() {
    return this.prisma.productStock.findMany({
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.productStock.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Запис не знайдено');
    return record;
  }

  async update(id: string, dto: UpdateInventoryDto) {
    await this.findOne(id);
    return this.prisma.productStock.update({
      where: { id },
      data: dto,
    });
  }

  async findByWarehouseId(warehouseId: string, query: FilterInventoryDto) {
    try {
      const {
        search = '',
        categoryId,
        isActive,
        sortBy = '',
        sortOrder = '',
        page,
        limit,
      } = query;

      // ---- Фільтрація по продукту ----
      const whereProduct: Prisma.ProductWhereInput = {};
      if (search) {
        whereProduct.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (categoryId) {
        whereProduct.categoryId = categoryId;
      }
      if (typeof isActive !== 'undefined' && isActive !== '') {
        if (typeof isActive === 'string') {
          whereProduct.isActive = isActive === 'true';
        } else {
          whereProduct.isActive = isActive;
        }
      }

      // ---- Сортування ----
      let orderBy: Prisma.ProductStockOrderByWithRelationInput = {};
      if (sortBy === 'price') {
        orderBy = { product: { price: sortOrder === 'desc' ? 'desc' : 'asc' } };
      } else if (sortBy === 'quantity') {
        orderBy = { quantity: sortOrder === 'desc' ? 'desc' : 'asc' };
      } else if (sortBy === 'name') {
        orderBy = { product: { name: sortOrder === 'desc' ? 'desc' : 'asc' } };
      } else {
        orderBy = {};
      }

      // ---- Пагінація ----
      const take = limit ? Number(limit) : undefined;
      const skip = take && page ? (Number(page) - 1) * take : undefined;

      // ---- Total count ----
      const total = await this.prisma.productStock.count({
        where: {
          warehouseId,
          product: whereProduct,
        },
      });

      // ---- Main query ----
      const stocks = await this.prisma.productStock.findMany({
        where: {
          warehouseId,
          product: whereProduct,
        },
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              categoryId: true,
              isActive: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      });

      // ---- Якщо не вказано ліміт — повертаємо ВСЕ ----
      return {
        items: stocks.map((stock) => ({
          id: stock.id,
          productId: stock.product.id,
          productName: stock.product.name,
          quantity: stock.quantity,
          description: stock.product.description,
          price: stock.product.price,
          categoryId: stock.product.categoryId,
          isActive: stock.product.isActive,
        })),
        total,
        page: page ? Number(page) : 1,
        limit: take ?? total, // якщо не вказано ліміт, повертаємо все
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Помилка при пошуку товарів на складі',
      );
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productStock.delete({ where: { id } });
  }
}
