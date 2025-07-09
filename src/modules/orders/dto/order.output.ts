import { ApiProperty } from '@nestjs/swagger';
import { OrderItemOutputDto } from './order-item.output';

export class OrderOutputDto {
  @ApiProperty({ example: 'order-uuid' }) id: string;
  @ApiProperty({ example: 101 }) orderNumber: number;
  @ApiProperty({ example: 'user-uuid', required: false }) userId?: string;
  @ApiProperty({ example: 'Іван Петренко', required: false })
  customerName?: string;
  @ApiProperty({ example: '+380971234567', required: false })
  customerPhone?: string;
  @ApiProperty({ example: 'test@gmail.com', required: false })
  customerEmail?: string;
  @ApiProperty({ example: 'nova_poshta', required: false })
  deliveryType?: string;

  @ApiProperty({
    example: { city: 'Львів', warehouse: '23' },
    required: false,
    type: Object,
  })
  deliveryData?: Record<string, any>;

  @ApiProperty({ example: 'Буду вдома після 19:00', required: false })
  comment?: string;
  @ApiProperty({ example: '799.00', required: false }) totalPrice?: string;

  @ApiProperty({ type: [OrderItemOutputDto] }) items: OrderItemOutputDto[];
}
