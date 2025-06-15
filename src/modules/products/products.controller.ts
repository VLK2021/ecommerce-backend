import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  HttpCode,
  NotFoundException,
  Patch,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductInputDto } from './dto/create-product.input';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AwsService } from '../aws/aws.service';
import { FilterProductsDto } from './dto/filter-products.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly awsService: AwsService,
  ) {}

  @Get('/presign')
  @ApiOperation({ summary: 'Отримати pre-signed URL для завантаження на S3' })
  async getPresignedUrl(
    @Query('filename') filename: string,
    @Query('type') type: string,
  ) {
    if (!filename || !type) {
      throw new BadRequestException('filename і type обовʼязкові');
    }

    const ext = filename.split('.').pop();
    const key = `products/${Date.now()}-${Math.random()}.${ext}`;
    const url = await this.awsService.generatePresignedUrl(key, type);

    return { url, key };
  }

  @Post()
  @ApiOperation({ summary: 'Створити продукт' })
  @ApiBody({ type: CreateProductInputDto })
  async create(@Body() dto: CreateProductInputDto) {
    return this.productsService.create(dto, dto.images || []);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити продукт' })
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @HttpCode(200)
  @Get()
  @ApiOperation({
    summary: 'Отримати всі продукти (з фільтрацією/сортуванням/пагінацією)',
  })
  async findAll(@Query() filter: FilterProductsDto) {
    return this.productsService.findAll(filter);
  }

  @HttpCode(200)
  @Get(':id')
  @ApiOperation({ summary: 'Отримати продукт по ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.productsService.findById(id);
    if (!result) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }
    return result;
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити продукт' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
  }
}
