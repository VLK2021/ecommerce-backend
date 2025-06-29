import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class FilterUsersDto {
  @ApiPropertyOptional({
    description: 'Пошук по імені, email або телефону',
    example: 'Ivan',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Роль користувача',
    enum: Role,
    example: 'USER',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ description: 'Сторінка', example: '1', default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Ліміт на сторінку',
    example: '20',
    default: 20,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
