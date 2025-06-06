import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeType } from '@prisma/client';

export class CreateAttributeDto {
  @ApiProperty({ example: 'Колір', description: 'Назва атрибуту' })
  @IsString()
  name: string;

  @ApiProperty({
    enum: AttributeType,
    example: AttributeType.STRING,
    description: 'Тип значення (STRING | NUMBER | SELECT)',
  })
  @IsEnum(AttributeType)
  type: AttributeType;
}
