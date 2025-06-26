import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderStatusOutput {
  @ApiProperty({ example: 'status-uuid' }) id: string;
  @ApiProperty({ example: 'order-uuid' }) orderId: string;
  @ApiProperty({
    example: OrderStatus.SHIPPED,
    enum: OrderStatus,
    description: 'Статус замовлення (enum)',
  })
  status: OrderStatus;
  @ApiProperty({ example: 'Відправлено курʼєром', required: false })
  comment?: string;
  @ApiProperty({ example: '2024-07-02T12:20:00Z' }) createdAt: string;
}
