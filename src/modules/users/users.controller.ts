import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Список користувачів з фільтрами, пагінацією, пошуком',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Пошук по імені/email/телефону',
    example: 'Ivan',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Роль користувача',
    example: 'USER',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Сторінка',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Ліміт',
    example: 20,
  })
  @ApiOkResponse({
    description: 'Список користувачів',
    schema: {
      example: {
        users: [
          {
            id: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
            email: 'user@example.com',
            name: 'Іван',
            phone: '+380123456789',
            avatar: 'https://example.com/avatar.jpg',
            role: 'USER',
            isActive: true,
            lastLogin: '2024-06-30T10:32:14.183Z',
            createdAt: '2024-06-30T10:32:14.183Z',
            updatedAt: '2024-06-30T10:32:14.183Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      },
    },
  })
  findAll(@Query() query: FilterUsersDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Створення нового користувача' })
  @ApiCreatedResponse({
    description: 'Користувача створено',
    type: UserEntity,
    schema: {
      example: {
        id: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
        email: 'user@example.com',
        name: 'Іван',
        phone: '+380123456789',
        avatar: 'https://example.com/avatar.jpg',
        role: 'USER',
        isActive: true,
        lastLogin: null,
        createdAt: '2024-06-30T10:32:14.183Z',
        updatedAt: '2024-06-30T10:32:14.183Z',
      },
    },
  })
  create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детальна інформація про користувача' })
  @ApiParam({
    name: 'id',
    description: 'ID користувача',
    example: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
  })
  @ApiOkResponse({
    description: 'Деталі користувача',
    type: UserEntity,
    schema: {
      example: {
        id: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
        email: 'user@example.com',
        name: 'Іван',
        phone: '+380123456789',
        avatar: 'https://example.com/avatar.jpg',
        role: 'USER',
        isActive: true,
        lastLogin: '2024-06-30T10:32:14.183Z',
        createdAt: '2024-06-30T10:32:14.183Z',
        updatedAt: '2024-06-30T10:32:14.183Z',
      },
    },
  })
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані користувача' })
  @ApiParam({
    name: 'id',
    description: 'ID користувача',
    example: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
  })
  @ApiOkResponse({
    description: 'Оновлений користувач',
    type: UserEntity,
    schema: {
      example: {
        id: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
        email: 'user@example.com',
        name: 'Олександр',
        phone: '+380987654321',
        avatar: 'https://example.com/avatar2.jpg',
        role: 'USER',
        isActive: true,
        lastLogin: '2024-06-30T10:32:14.183Z',
        createdAt: '2024-06-30T10:32:14.183Z',
        updatedAt: '2024-06-30T10:32:14.183Z',
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Деактивувати користувача (soft-delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID користувача',
    example: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
  })
  @ApiOkResponse({
    description: 'Користувача деактивовано',
    type: UserEntity,
    schema: {
      example: {
        id: 'ad9d4a17-12b7-4bce-982d-f34e179ef1ac',
        email: 'user@example.com',
        name: 'Іван',
        phone: '+380123456789',
        avatar: 'https://example.com/avatar.jpg',
        role: 'USER',
        isActive: false,
        lastLogin: '2024-06-30T10:32:14.183Z',
        createdAt: '2024-06-30T10:32:14.183Z',
        updatedAt: '2024-06-30T10:32:14.183Z',
      },
    },
  })
  deactivate(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.deactivate(id);
  }
}
