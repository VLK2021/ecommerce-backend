import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'product-uuid', description: 'ID товару' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Кількість' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 159.99, description: 'Ціна на момент замовлення' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'Кава зернова', description: 'Назва товару' })
  @IsString()
  productName: string;

  @ApiProperty({
    example: 'cat-uuid',
    required: false,
    description: 'ID категорії',
  })
  @IsOptional()
  @IsString()
  productCategoryId?: string | null;

  @ApiProperty({
    example: 'Кава',
    required: false,
    description: 'Назва категорії',
  })
  @IsOptional()
  @IsString()
  productCategoryName?: string | null;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Чи був активний товар',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean | null;
}
