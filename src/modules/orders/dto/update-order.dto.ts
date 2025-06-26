import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'CANCELLED', description: 'Новий статус' })
  status?: string;

  @ApiPropertyOptional({ example: 'Передзвоніть, будь ласка.' })
  comment?: string;

  @ApiPropertyOptional({
    example: 'courier',
    description: 'Новий тип доставки',
  })
  deliveryType?: string;

  @ApiPropertyOptional({
    example: { address: 'вул. Головна, 22' },
    description: 'Нові дані для доставки',
    type: Object,
  })
  deliveryData?: Record<string, any>;
}
