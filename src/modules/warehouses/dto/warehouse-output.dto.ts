import { ApiProperty } from '@nestjs/swagger';

export class WarehouseOutputDto {
  @ApiProperty({ example: 'uuid-1234' })
  id: string;

  @ApiProperty({ example: 'Склад Київ №1' })
  name: string;

  @ApiProperty({ example: 'Київ' })
  city: string;

  @ApiProperty({ example: 'вул. Відрадна 10' })
  address: string;

  @ApiProperty({ example: '+380501234567', required: false })
  phone?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
