import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentProvider } from '@prisma/client';

export class CreatePaymentInput {
  @ApiProperty({ example: 'order-uuid' })
  orderId: string;

  @ApiProperty({ example: 999.99 })
  amount: number;

  @ApiPropertyOptional({ example: 'CARD' })
  method?: string; // 'CARD', 'CASH', 'BANK_TRANSFER', etc.

  @ApiProperty({
    example: 'LIQPAY',
    enum: PaymentProvider,
    description: 'Платіжний провайдер (enum: LIQPAY, PAYPAL, ...)',
  })
  provider: PaymentProvider;

  @ApiPropertyOptional({ example: 'external-id-from-provider' })
  externalId?: string;

  @ApiPropertyOptional({ example: 'UAH' })
  currency?: string;
}
