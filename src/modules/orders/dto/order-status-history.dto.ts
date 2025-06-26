import { ApiProperty } from '@nestjs/swagger';

export class OrderStatusHistoryDto {
  @ApiProperty({ example: 'CREATED', description: 'Статус замовлення' })
  status: string;

  @ApiProperty({ example: '2024-06-01T12:00:00Z', description: 'Дата зміни' })
  createdAt: string;

  @ApiProperty({ example: 'Оператор створив замовлення', required: false })
  comment?: string;
}
