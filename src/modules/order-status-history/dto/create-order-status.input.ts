import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateOrderStatusInput {
  @ApiProperty({ example: 'order-uuid', description: 'ID замовлення' })
  orderId: string;

  @ApiProperty({
    example: OrderStatus.SHIPPED,
    enum: OrderStatus,
    description:
      'Новий статус (enum: NEW, PROCESSING, PAID, SHIPPED, DELIVERED, CANCELLED, RETURNED)',
  })
  status: OrderStatus;

  @ApiProperty({ example: 'Відправлено курʼєром', required: false })
  comment?: string;
}
