import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateOrderDto {
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
}
