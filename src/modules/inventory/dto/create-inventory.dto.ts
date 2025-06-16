import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  warehouseId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  quantity: number;
}
