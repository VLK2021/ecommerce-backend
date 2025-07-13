import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsObject,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: 'warehouse-uuid' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

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

  @ApiPropertyOptional({ example: 'CANCELLED', description: 'Новий статус' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Передзвоніть, будь ласка.' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    example: 'courier',
    description: 'Новий тип доставки',
  })
  @IsOptional()
  @IsString()
  deliveryType?: string;

  @ApiPropertyOptional({
    example: 'cod',
    description: 'Тип оплати (cod, card_online, ...)',
  })
  @IsOptional()
  @IsString()
  paymentType?: string;

  @ApiPropertyOptional({
    example: { address: 'вул. Головна, 22' },
    description: 'Нові дані для доставки',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  deliveryData?: Record<string, any>;

  @ApiPropertyOptional({ example: 640.5 })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiPropertyOptional({ type: [CreateOrderItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
