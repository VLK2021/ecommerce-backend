import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'warehouse-uuid', description: 'ID складу' })
  @IsString()
  warehouseId: string;

  @ApiPropertyOptional({ example: 'Іван Петренко' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ example: '+380971234567' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ example: 'test@gmail.com' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiPropertyOptional({ example: 'nova_poshta' })
  @IsOptional()
  @IsString()
  deliveryType?: string;

  @ApiPropertyOptional({
    example: { city: 'Львів', warehouse: '23' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  deliveryData?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Буду вдома після 19:00' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: 640.5 })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
