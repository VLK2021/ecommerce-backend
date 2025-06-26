import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class FilterOrderStatusInput {
  @ApiPropertyOptional({ example: 'order-uuid', description: 'ID замовлення' })
  orderId?: string;

  @ApiPropertyOptional({
    example: OrderStatus.SHIPPED,
    enum: OrderStatus,
    description: 'Статус (enum)',
  })
  status?: OrderStatus;

  @ApiPropertyOptional({ example: 1 }) page?: number;
  @ApiPropertyOptional({ example: 20 }) limit?: number;
}
