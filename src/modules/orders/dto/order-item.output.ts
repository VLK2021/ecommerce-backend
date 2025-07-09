import { ApiProperty } from '@nestjs/swagger';

export class OrderItemOutputDto {
  @ApiProperty({ example: 'item-uuid' }) id: string;
  @ApiProperty({ example: 'product-uuid' }) productId: string;
  @ApiProperty({ example: 2 }) quantity: number;
  @ApiProperty({ example: '149.99' }) price: string;
  @ApiProperty({ example: 'Велосипед' }) productName: string;
  @ApiProperty({ example: 'cat-uuid', required: false })
  productCategoryId?: string;
  @ApiProperty({ example: 'Велосипеди', required: false })
  productCategoryName?: string;
  @ApiProperty({ example: true, required: false }) isActive?: boolean;

  @ApiProperty({ example: 'warehouse-uuid' }) warehouseId: string;
  @ApiProperty({ example: 'Основний склад', required: false })
  warehouseName?: string;
}
