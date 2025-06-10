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

type ProductWithRelations = Product & {
  category?: { id: string; name: string };
  images: ProductImage[];
  attributeValues: (AttributeValue & { attribute?: Attribute | null })[];
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

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
    const { attributeValues, ...productData } = dto;

    try {
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

      const updated = await this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
          ...(dto.price && { price: new Prisma.Decimal(dto.price) }),
        },
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

  async findAll() {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          category: true,
          images: true,
          attributeValues: {
            include: { attribute: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return products.map((product) => this.formatProduct(product));
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
      await this.prisma.attributeValue.deleteMany({ where: { productId: id } });
      await this.prisma.productImage.deleteMany({ where: { productId: id } });

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
