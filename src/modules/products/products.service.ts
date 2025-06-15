import { Injectable, InternalServerErrorException } from '@nestjs/common';

import {
  Prisma,
  Product,
  ProductImage,
  AttributeValue,
  Attribute,
} from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductInputDto } from './dto/create-product.input';
import { UpdateProductDto } from './dto/update-product.dto';
import { AwsService } from '../aws/aws.service';
import { FilterProductsDto } from './dto/filter-products.dto';

type ProductWithRelations = Product & {
  category?: { id: string; name: string };
  images: ProductImage[];
  attributeValues: (AttributeValue & { attribute?: Attribute | null })[];
};

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private awsService: AwsService,
  ) {}

  async create(dto: CreateProductInputDto, imageUrls: string[]) {
    const { attributeValues, ...productData } = dto;

    try {
      const product = await this.prisma.product.create({
        data: {
          ...productData,
          price: new Prisma.Decimal(dto.price),
          attributeValues: {
            create: attributeValues.map((attr) => ({
              value: attr.value,
              attribute: { connect: { id: attr.attributeId } },
            })),
          },
          images: {
            create: imageUrls.map((url, i) => ({
              url,
              isMain: i === 0,
            })),
          },
        },
        include: {
          category: true,
          images: true,
          attributeValues: {
            include: { attribute: true },
          },
        },
      });

      return this.formatProduct(product);
    } catch (error) {
      console.error('❌ CREATE PRODUCT ERROR:', error);
      throw new InternalServerErrorException('Не вдалося створити продукт');
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    const {
      attributeValues,
      images,
      deletedImages,
      name,
      price,
      description,
      isActive,
      stock,
      categoryId,
    } = dto;

    try {
      // 1. Оновити атрибути
      if (attributeValues) {
        await this.prisma.attributeValue.deleteMany({
          where: { productId: id },
        });

        await this.prisma.attributeValue.createMany({
          data: attributeValues.map((attr) => ({
            productId: id,
            attributeId: attr.attributeId,
            value: attr.value,
          })),
        });
      }

      // 2. Видалити фото з бази і бакету
      if (deletedImages && deletedImages.length > 0) {
        await this.prisma.productImage.deleteMany({
          where: {
            productId: id,
            url: { in: deletedImages },
          },
        });

        for (const url of deletedImages) {
          const key = url.split('.com/')[1];
          if (key) {
            await this.awsService.deleteFile(key);
          }
        }
      }

      // 3. Додати нові фото
      if (images) {
        const existing = await this.prisma.productImage.findMany({
          where: { productId: id },
        });

        const existingUrls = existing.map((img) => img.url);
        const newUrls = images.filter((url) => !existingUrls.includes(url));

        for (let i = 0; i < newUrls.length; i++) {
          await this.prisma.productImage.create({
            data: {
              productId: id,
              url: newUrls[i],
              isMain: i === 0,
            },
          });
        }
      }

      // 4. Формування даних для оновлення
      const updateData: Prisma.ProductUpdateInput = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (stock !== undefined) updateData.stock = stock;
      if (price !== undefined) updateData.price = new Prisma.Decimal(price);
      if (categoryId !== undefined) {
        updateData.category = { connect: { id: categoryId } };
      }

      // 5. Оновлення продукту
      const updated = await this.prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          images: true,
          attributeValues: {
            include: { attribute: true },
          },
        },
      });

      return this.formatProduct(updated);
    } catch (error) {
      console.error('❌ UPDATE PRODUCT ERROR:', error);
      throw new InternalServerErrorException('Не вдалося оновити продукт');
    }
  }

  async findAll(filter: FilterProductsDto) {
    try {
      const {
        search,
        categoryId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
      } = filter;

      const where: Prisma.ProductWhereInput = {};

      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      const totalItems = await this.prisma.product.count({ where });

      const products = await this.prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
          attributeValues: {
            include: { attribute: true },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        items: products.map((product) => this.formatProduct(product)),
      };
    } catch (error) {
      console.error('❌ FIND ALL PRODUCTS ERROR:', error);
      throw new InternalServerErrorException('Не вдалося отримати продукти');
    }
  }

  async findById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
          attributeValues: {
            include: { attribute: true },
          },
        },
      });

      if (!product) return null;
      return this.formatProduct(product);
    } catch (error) {
      console.error('❌ FIND PRODUCT BY ID ERROR:', error);
      throw new InternalServerErrorException('Не вдалося знайти продукт');
    }
  }

  async remove(id: string) {
    try {
      const images = await this.prisma.productImage.findMany({
        where: { productId: id },
      });

      await this.prisma.attributeValue.deleteMany({ where: { productId: id } });
      await this.prisma.productImage.deleteMany({ where: { productId: id } });

      for (const img of images) {
        const key = img.url.split('.com/')[1];
        if (key) {
          await this.awsService.deleteFile(key);
        }
      }

      return this.prisma.product.delete({ where: { id } });
    } catch (error) {
      console.error('❌ REMOVE PRODUCT ERROR:', error);
      throw new InternalServerErrorException('Не вдалося видалити продукт');
    }
  }

  private formatProduct(product: ProductWithRelations) {
    return {
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description ?? undefined,
      isActive: product.isActive,
      stock: product.stock,
      category: {
        id: product.categoryId,
        name: product.category?.name || '',
      },
      images: product.images,
      attributeValues: product.attributeValues.map((v) => ({
        attributeId: v.attributeId,
        value: v.value,
        name: v.attribute?.name || '',
      })),
    };
  }
}
