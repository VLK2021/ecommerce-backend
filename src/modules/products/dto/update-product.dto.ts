import {
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsNumberString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AttributeValueUpdateInput {
  @ApiProperty({ example: 'uuid-attribute' })
  @IsString()
  attributeId: string;

  @ApiProperty({ example: '512 GB' })
  @IsString()
  value: string;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '1399.00', required: false })
  @IsOptional()
  @IsNumberString()
  price?: string;

  @ApiProperty({ example: 'Опис товару', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'uuid-category', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  stock?: number;

  @ApiProperty({ type: [AttributeValueUpdateInput], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeValueUpdateInput)
  attributeValues?: AttributeValueUpdateInput[];
}
