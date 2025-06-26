import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'product-uuid', description: 'ID товару' })
  productId: string;

  @ApiProperty({ example: 3, description: 'Кількість' })
  quantity: number;

  @ApiProperty({ example: 180, description: 'Ціна на момент замовлення' })
  price: number;

  @ApiProperty({ example: 'Кава зернова', description: 'Назва товару' })
  productName: string;

  @ApiProperty({
    example: 'category-uuid',
    description: 'ID категорії',
    required: false,
  })
  productCategoryId?: string;

  @ApiProperty({
    example: 'Кава',
    description: 'Назва категорії',
    required: false,
  })
  productCategoryName?: string;

  @ApiProperty({
    example: true,
    description: 'Чи був активний товар',
    required: false,
  })
  isActive?: boolean;
}
