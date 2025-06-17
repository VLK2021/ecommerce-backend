import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Склад Київ №1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Київ' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Склад техніки' })
  @IsString()
  description?: string;

  @ApiProperty({ example: 'вул. Відрадна 10' })
  @IsString()
  address: string;

  @ApiProperty({ example: '+380501234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
