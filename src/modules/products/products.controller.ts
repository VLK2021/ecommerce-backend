import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Param,
  Get,
  Delete,
  HttpCode,
  NotFoundException, Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductInputDto,
  AttributeValueInput,
} from './dto/create-product.input';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити продукт' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductInputDto })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/products',
        filename: (_, file, cb) => {
          const filename = `${Date.now()}-${Math.random()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: Record<string, string>,
  ) {
    const imageUrls =
      files?.map((f) => `/uploads/products/${f.filename}`) || [];

    const dto: CreateProductInputDto = {
      name: body.name,
      price: body.price,
      description: body.description || undefined,
      categoryId: body.categoryId,
      isActive: body.isActive === 'true',
      stock: body.stock ? parseInt(body.stock, 10) : undefined,
      attributeValues: [],
    };

    if (typeof body.attributeValues === 'string') {
      try {
        const parsed: unknown = JSON.parse(body.attributeValues);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item): item is AttributeValueInput =>
              typeof item === 'object' &&
              item !== null &&
              typeof (item as Record<string, unknown>).attributeId ===
                'string' &&
              typeof (item as Record<string, unknown>).value === 'string',
          )
        ) {
          dto.attributeValues = parsed;
        }
      } catch {
        dto.attributeValues = [];
      }
    }

    return this.productsService.create(dto, imageUrls);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити продукт' })
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @HttpCode(200)
  @Get()
  @ApiOperation({ summary: 'Отримати всі продукти' })
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map((p) => ({
      ...p,
      price: p.price?.toString() ?? '0',
      description: p.description ?? undefined,
    }));
  }

  @HttpCode(200)
  @Get(':id')
  @ApiOperation({ summary: 'Отримати продукт по ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.productsService.findById(id);

    if (!result) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }

    const product = result;

    return {
      ...product,
      price: product.price?.toString() ?? '0',
      description: product.description ?? undefined,
    };
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити продукт' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
  }
}
