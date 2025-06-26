// create-order-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'product-uuid', description: 'ID товару' })
  productId: string;

  @ApiProperty({ example: 2, description: 'Кількість' })
  quantity: number;

  @ApiProperty({ example: 159.99, description: 'Ціна на момент замовлення' })
  price: number;

  @ApiProperty({ example: 'Кава зернова', description: 'Назва товару' })
  productName: string;

  @ApiProperty({
    example: 'cat-uuid',
    required: false,
    description: 'ID категорії',
  })
  productCategoryId?: string | null;

  @ApiProperty({
    example: 'Кава',
    required: false,
    description: 'Назва категорії',
  })
  productCategoryName?: string | null;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Чи був активний товар',
  })
  isActive?: boolean | null;
}
