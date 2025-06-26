import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentStatusInput {
  @ApiProperty({ example: 'PAID', enum: PaymentStatus })
  status: PaymentStatus;
  @ApiProperty({ example: 'external-id-from-provider', required: false })
  externalId?: string;
}
