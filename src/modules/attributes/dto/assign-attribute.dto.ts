import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray } from 'class-validator';

export class AssignAttributeDto {
  @ApiProperty({ example: 'category-uuid' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: ['attribute-uuid-1', 'attribute-uuid-2'] })
  @IsArray()
  @IsUUID('all', { each: true })
  attributeIds: string[];
}
