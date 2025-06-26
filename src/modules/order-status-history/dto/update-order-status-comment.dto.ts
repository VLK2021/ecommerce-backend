import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderStatusCommentDto {
  @ApiPropertyOptional({ example: 'Новий коментар' })
  comment?: string;
}
