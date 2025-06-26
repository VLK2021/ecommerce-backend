import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'user-uuid' })
  userId?: string;

  @ApiPropertyOptional({ example: 'Іван Петренко' })
  customerName?: string;

  @ApiPropertyOptional({ example: '+380971234567' })
  customerPhone?: string;

  @ApiPropertyOptional({ example: 'test@gmail.com' })
  customerEmail?: string;

  @ApiPropertyOptional({ example: 'nova_poshta' })
  deliveryType?: string;

  @ApiPropertyOptional({
    example: { city: 'Львів', warehouse: '23' },
    type: Object,
  })
  deliveryData?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Буду вдома після 19:00' })
  comment?: string;

  @ApiPropertyOptional({ example: 640.5 })
  totalPrice?: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  items: CreateOrderItemDto[];
}
