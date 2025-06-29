import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserEntity {
  @ApiProperty({
    example: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
    description: 'ID користувача',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача',
  })
  email: string;

  @ApiProperty({ example: 'USER', enum: Role, description: 'Роль користувача' })
  role: Role;

  @ApiProperty({
    example: 'Іван',
    description: "Ім'я користувача",
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    example: '+380123456789',
    description: 'Телефон',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Аватар',
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({ example: true, description: 'Активність' })
  isActive: boolean;

  @ApiProperty({
    example: '2024-06-30T10:32:14.183Z',
    description: 'Дата останнього входу',
    nullable: true,
  })
  lastLogin: Date | null;

  @ApiProperty({ example: '2024-06-30T10:32:14.183Z', description: 'Створено' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-30T10:32:14.183Z', description: 'Оновлено' })
  updatedAt: Date;
}
