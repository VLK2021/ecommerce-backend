import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
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

  async findAll(): Promise<Array<{ id: string; name: string; hasAttributes: boolean }>> {
    const categories = await this.prisma.category.findMany({
      include: {
        categoryAttributes: {
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      hasAttributes: category.categoryAttributes.length > 0,
    }));
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



// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../../../prisma/prisma.service';
// import { CreateCategoryDto } from '../dto/create-category.dto';
// import { UpdateCategoryDto } from '../dto/update-category.dto';
//
// @Injectable()
// export class CategoriesService {
//   constructor(private prisma: PrismaService) {}
//
//   async create(dto: CreateCategoryDto): Promise<{ id: string; name: string }> {
//     return this.prisma.category.create({
//       data: dto,
//       select: {
//         id: true,
//         name: true,
//       },
//     });
//   }
//
//   async findAll(): Promise<Array<{ id: string; name: string }>> {
//     return this.prisma.category.findMany({
//       select: {
//         id: true,
//         name: true,
//       },
//     });
//   }
//
//   async findOne(id: string): Promise<{ id: string; name: string } | null> {
//     return this.prisma.category.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         name: true,
//       },
//     });
//   }
//
//   async update(id: string, dto: UpdateCategoryDto): Promise<{ id: string; name: string }> {
//     return this.prisma.category.update({
//       where: { id },
//       data: dto,
//       select: {
//         id: true,
//         name: true,
//       },
//     });
//   }
//
//   async delete(id: string): Promise<{ id: string; name: string }> {
//     return this.prisma.category.delete({
//       where: { id },
//       select: {
//         id: true,
//         name: true,
//       },
//     });
//   }
// }
//
