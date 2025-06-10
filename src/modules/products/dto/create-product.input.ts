import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AttributeValueInput {
  @ApiProperty({ example: 'clxyz123' })
  @IsString()
  attributeId: string;

  @ApiProperty({ example: '128 GB' })
  @IsString()
  value: string;
}

export class CreateProductInputDto {
  @ApiProperty({ example: 'iPhone 14' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '999.99' })
  @IsString()
  price: string;

  @ApiProperty({ example: 'Новий смартфон Apple', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'clcategory123' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  stock?: number;

  @ApiProperty({
    type: [AttributeValueInput],
    example: [
      { attributeId: 'clx123', value: '128 GB' },
      { attributeId: 'clx456', value: 'Blue' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeValueInput)
  attributeValues: AttributeValueInput[];

  @ApiProperty({
    type: [String],
    example: [
      'https://your-s3-url/products/img1.jpg',
      'https://your-s3-url/products/img2.jpg',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
