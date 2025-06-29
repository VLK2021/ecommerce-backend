import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Унікальний email користувача',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'supersecret',
    description: 'Пароль (мінімум 6 символів)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Іван', description: "Ім'я користувача" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '+380123456789',
    description: 'Телефон у міжнародному форматі',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Посилання на аватар',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
