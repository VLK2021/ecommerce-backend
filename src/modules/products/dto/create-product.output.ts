import { AttributeType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductImageDto {
  @ApiProperty({ example: 'uuid-1234' })
  id: string;

  @ApiProperty({ example: '/uploads/products/image1.jpg' })
  url: string;

  @ApiProperty({ example: true })
  isMain: boolean;
}

export class ProductAttributeValueDto {
  @ApiProperty({ example: 'uuid-attr-val' })
  id: string;

  @ApiProperty({ example: '128 GB' })
  value: string;

  @ApiProperty({ example: 'uuid-attr' })
  attributeId: string;

  @ApiProperty({
    example: {
      id: 'uuid-attr',
      name: 'Памʼять',
      type: 'SELECT',
    },
  })
  attribute: {
    id: string;
    name: string;
    type: AttributeType;
  };
}

export class CreateProductOutputDto {
  @ApiProperty({ example: 'uuid-prod' })
  id: string;

  @ApiProperty({ example: 'iPhone 14' })
  name: string;

  @ApiProperty({ example: '1099.00' })
  price: string;

  @ApiProperty({ example: 'Новий смартфон Apple', required: false })
  description?: string;

  @ApiProperty({ example: 15 })
  stock: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'uuid-category' })
  categoryId: string;

  @ApiProperty({ type: [ProductImageDto] })
  images: ProductImageDto[];

  @ApiProperty({ type: [ProductAttributeValueDto] })
  attributeValues: ProductAttributeValueDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
