import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'supersecret',
    description: 'Пароль (мін. 6 символів)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: 'Іван',
    description: 'Імʼя користувача (необовʼязково)',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
