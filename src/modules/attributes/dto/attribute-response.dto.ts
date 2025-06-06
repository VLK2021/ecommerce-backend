import { ApiProperty } from '@nestjs/swagger';
import { AttributeType } from '@prisma/client';

export class AttributeResponseDto {
  @ApiProperty({ example: 'uuid', description: 'ID атрибуту' })
  id: string;

  @ApiProperty({ example: 'Колір', description: 'Назва атрибуту' })
  name: string;

  @ApiProperty({
    enum: AttributeType,
    example: AttributeType.STRING,
    description: 'Тип атрибуту',
  })
  type: AttributeType;
}
