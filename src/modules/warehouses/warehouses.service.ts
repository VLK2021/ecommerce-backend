import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({ data: dto });
  }

  async findAll(params?: {
    search?: string;
    sortBy?: 'name';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    page?: number;
  }) {
    const {
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
      limit,
      page,
    } = params || {};

    const where: Prisma.WarehouseWhereInput = search
      ? {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }
      : {};

    const orderBy = { [sortBy]: sortOrder };

    const take = limit ?? undefined;
    const skip = take && page ? (page - 1) * take : undefined;

    const [items, totalItems] = await Promise.all([
      this.prisma.warehouse.findMany({ where, orderBy, take, skip }),
      this.prisma.warehouse.count({ where }),
    ]);

    return {
      items,
      totalItems,
      totalPages: take ? Math.ceil(totalItems / take) : 1,
      currentPage: page ?? 1,
    };
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
