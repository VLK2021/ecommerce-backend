import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCategoryDto): Promise<{ id: string; name: string }> {
    return this.prisma.category.create({
      data: dto,
      select: {
        id: true,
        name: true,
      },
    });
  }

  findAll(): Promise<Array<{ id: string; name: string }>> {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  findOne(id: string): Promise<{ id: string; name: string } | null> {
    return this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  }

  update(id: string, dto: UpdateCategoryDto): Promise<{ id: string; name: string }> {
    return this.prisma.category.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
      },
    });
  }

  remove(id: string): Promise<{ id: string; name: string }> {
    return this.prisma.category.delete({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
