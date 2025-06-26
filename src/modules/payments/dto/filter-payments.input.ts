import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, PaymentProvider } from '@prisma/client';

export class FilterPaymentsInput {
  @ApiPropertyOptional({ example: 'order-uuid' }) orderId?: string;
  @ApiPropertyOptional({ example: 'PAID', enum: PaymentStatus })
  status?: PaymentStatus;
  @ApiPropertyOptional({ example: 'CARD' }) method?: string;
  @ApiPropertyOptional({ example: 'LIQPAY', enum: PaymentProvider })
  provider?: PaymentProvider;
  @ApiPropertyOptional({ example: 1 }) page?: number;
  @ApiPropertyOptional({ example: 20 }) limit?: number;
}
