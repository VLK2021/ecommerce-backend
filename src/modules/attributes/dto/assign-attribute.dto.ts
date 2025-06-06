import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAttributeDto {
  @ApiProperty({
    example: 'category-uuid',
    description: 'ID категорії',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: 'attribute-uuid',
    description: 'ID атрибуту',
  })
  @IsUUID()
  attributeId: string;
}
