import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInventoryDto) {
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productStock.delete({ where: { id } });
  }
}
