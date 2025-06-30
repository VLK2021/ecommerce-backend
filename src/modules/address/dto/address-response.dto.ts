import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({ example: 'adrs-12345', description: 'ID адреси' })
  id: string;

  @ApiProperty({ example: 'user-12345', description: 'ID користувача' })
  userId: string;

  @ApiPropertyOptional({ example: 'Дім', description: 'Мітка' })
  label: string | null;

  @ApiProperty({ example: 'Іван Іванов' })
  recipient: string;

  @ApiProperty({ example: '+380931234567' })
  phone: string;

  @ApiProperty({ example: 'Україна' })
  country: string;

  @ApiProperty({ example: 'Київ' })
  city: string;

  @ApiProperty({ example: 'Шевченка' })
  street: string;

  @ApiProperty({ example: '10' })
  house: string;

  @ApiPropertyOptional({ example: '25' })
  apartment: string | null;

  @ApiPropertyOptional({ example: '01001' })
  postal: string | null;

  @ApiPropertyOptional({ example: 'Підʼїзд 3, поверх 4' })
  comment: string | null;

  @ApiProperty({ example: false })
  isDefault: boolean;

  @ApiProperty({ example: '2024-06-30T16:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-30T16:00:00.000Z' })
  updatedAt: Date;
}
