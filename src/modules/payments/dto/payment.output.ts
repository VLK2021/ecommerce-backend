import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentProvider } from '@prisma/client';

export class PaymentOutput {
  @ApiProperty({ example: 'payment-uuid' }) id: string;
  @ApiProperty({ example: 'order-uuid' }) orderId: string;
  @ApiProperty({ example: 999.99 }) amount: number;
  @ApiProperty({ example: 'PAID', enum: PaymentStatus }) status: PaymentStatus;
  @ApiProperty({ example: 'CARD' }) method?: string;
  @ApiProperty({ example: 'LIQPAY', enum: PaymentProvider })
  provider?: PaymentProvider;
  @ApiProperty({ example: 'external-id' }) externalId?: string;
  @ApiProperty({ example: '2024-07-02T12:20:00Z' }) paidAt?: string;
  @ApiProperty({ example: 'UAH' }) currency?: string;
  @ApiProperty({ example: '2024-07-02T12:20:00Z' }) createdAt: string;
}
