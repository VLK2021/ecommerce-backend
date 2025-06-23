import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInventoryDto) {
    // Перевіряємо, чи вже є запис для цієї пари склад+товар
    const existing = await this.prisma.productStock.findUnique({
      where: {
        productId_warehouseId: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
        },
      },
    });

    if (existing) {
      // Якщо вже є — збільшуємо кількість
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

    // Якщо нема — створюємо новий запис
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

  async findByWarehouseId(warehouseId: string) {
    const stocks = await this.prisma.productStock.findMany({
      where: { warehouseId },
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Повертаємо у вигляді: { id, productId, productName, quantity }
    return stocks.map((stock) => ({
      id: stock.id,
      productId: stock.product.id,
      productName: stock.product.name,
      quantity: stock.quantity,
      description: stock.product.description,
      price: stock.product.price,
      categoryId: stock.product.categoryId,
    }));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productStock.delete({ where: { id } });
  }
}
