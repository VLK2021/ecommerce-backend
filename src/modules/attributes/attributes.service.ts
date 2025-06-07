import { Injectable } from '@nestjs/common';

import { CreateAttributeDto } from './dto/create-attribute.dto';
import { AssignAttributeDto } from './dto/assign-attribute.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAttributeDto) {
    return this.prisma.attribute.create({
      data: dto,
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  async update(id: string, dto: UpdateAttributeDto) {
    return this.prisma.attribute.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.attribute.delete({
      where: { id },
    });
  }

  async assignToCategory(dto: AssignAttributeDto) {
    const { categoryId, attributeIds } = dto;

    const createData = attributeIds.map(attributeId => ({
      categoryId,
      attributeId,
    }));

    return this.prisma.categoryAttribute.createMany({
      data: createData,
      skipDuplicates: true,
    });
  }


  async getAll() {
    const attributes = await this.prisma.attribute.findMany({
      include: {
        categoryAttributes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return attributes.map(attr => ({
      id: attr.id,
      name: attr.name,
      type: attr.type,
      assigned: attr.categoryAttributes.length > 0,
    }));
  }

  async getAllByCategory(categoryId: string) {
    return this.prisma.categoryAttribute.findMany({
      where: { categoryId },
      include: { attribute: true },
    });
  }
}
