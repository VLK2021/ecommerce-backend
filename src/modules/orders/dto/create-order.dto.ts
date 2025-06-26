import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiPropertyOptional({
    example: 'user-uuid',
    description: 'ID користувача (якщо є)',
  })
  userId?: string;

  @ApiPropertyOptional({
    example: 'Іван Петренко',
    description: "Ім'я покупця",
  })
  customerName?: string;

  @ApiPropertyOptional({
    example: '+380971234567',
    description: 'Телефон покупця',
  })
  customerPhone?: string;

  @ApiPropertyOptional({
    example: 'test@gmail.com',
    description: 'Email покупця',
  })
  customerEmail?: string;

  @ApiPropertyOptional({ example: 'nova_poshta', description: 'Тип доставки' })
  deliveryType?: string;

  @ApiPropertyOptional({
    example: { city: 'Львів', warehouse: '23' },
    description: 'Дані для доставки (обʼєкт)',
    type: Object,
  })
  deliveryData?: Record<string, any>;

  @ApiPropertyOptional({
    example: 'Буду вдома після 19:00',
    description: 'Коментар',
  })
  comment?: string;

  @ApiPropertyOptional({
    example: 640.5,
    description: 'Загальна сума замовлення',
  })
  totalPrice?: number;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Масив товарів у замовленні',
  })
  items: CreateOrderItemDto[];
}
