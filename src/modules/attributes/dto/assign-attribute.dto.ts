import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAttributeDto {
  @ApiProperty({ example: 'category-uuid', description: 'ID категорії' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: ['uuid1', 'uuid2'],
    description: 'Масив ID атрибутів',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  attributeIds: string[];
}
