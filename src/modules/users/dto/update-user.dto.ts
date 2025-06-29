import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'new@email.com',
    description: 'Оновлений email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Олександр', description: "Нове ім'я" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '+380987654321',
    description: 'Новий телефон',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar2.jpg',
    description: 'Новий аватар',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: true, description: 'Чи активний користувач' })
  @IsOptional()
  isActive?: boolean;
}
