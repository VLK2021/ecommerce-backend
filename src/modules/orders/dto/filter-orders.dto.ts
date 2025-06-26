import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterOrdersDto {
  @ApiPropertyOptional({ example: 'user-uuid' })
  userId?: string;

  @ApiPropertyOptional({ example: 'DELIVERED' })
  status?: string;

  @ApiPropertyOptional({ example: 'петренко' })
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt' })
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc' })
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;
}
