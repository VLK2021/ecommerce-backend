import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({ data: dto });
  }

  async findAll() {
    return this.prisma.warehouse.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundException('Склад не знайдено');
    return warehouse;
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    await this.findOne(id);
    return this.prisma.warehouse.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.warehouse.delete({ where: { id } });
  }
}
