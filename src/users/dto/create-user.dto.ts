import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'supersecret' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Іван' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+380123456789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
