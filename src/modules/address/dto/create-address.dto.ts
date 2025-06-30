import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({
    example: 'Дім',
    description: 'Мітка: дім, офіс, дача...',
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: 'Іван Іванов', description: 'Одержувач' })
  @IsString()
  recipient: string;

  @ApiProperty({ example: '+380931234567', description: 'Телефон' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Україна' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Київ' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Шевченка' })
  @IsString()
  street: string;

  @ApiProperty({ example: '10' })
  @IsString()
  house: string;

  @ApiPropertyOptional({
    example: '25',
    description: 'Квартира (необовʼязково)',
  })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiPropertyOptional({
    example: '01001',
    description: 'Поштовий індекс (необовʼязково)',
  })
  @IsOptional()
  @IsString()
  postal?: string;

  @ApiPropertyOptional({ example: 'Підʼїзд 3, поверх 4' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
