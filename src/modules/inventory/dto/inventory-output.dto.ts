import { ApiProperty } from '@nestjs/swagger';

export class InventoryOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
