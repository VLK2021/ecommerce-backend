import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterOrdersDto {
  @ApiPropertyOptional({ example: 'user-uuid' }) userId?: string;

  @ApiPropertyOptional({
    example: 'DELIVERED',
    description: 'Статус замовлення',
  })
  status?: string;

  @ApiPropertyOptional({
    example: 'петренко',
    description: 'Пошук по імені/email/телефону',
  })
  search?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Сортувати за полем',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Сортування (asc/desc)',
  })
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: 1 }) page?: number;

  @ApiPropertyOptional({ example: 20 }) limit?: number;
}
