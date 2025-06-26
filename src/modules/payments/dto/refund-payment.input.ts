import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentInput {
  @ApiProperty({ example: 'payment-uuid' }) paymentId: string;
  @ApiProperty({ example: 99.99 }) amount: number;
  @ApiProperty({
    example: 'Повернення за скасування замовлення',
    required: false,
  })
  reason?: string;
}
