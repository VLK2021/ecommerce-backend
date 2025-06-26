import { ApiProperty } from '@nestjs/swagger';

export class PaymentStatsOutput {
  @ApiProperty({ example: 99999.99 }) totalPaid: number;
  @ApiProperty({ example: 10 }) paidCount: number;
  @ApiProperty({ example: 1000.0 }) totalRefunded: number;
  @ApiProperty({ example: 3 }) refundedCount: number;
}
