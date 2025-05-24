import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'Список усіх користувачів' })
  getAll() {
    return this.usersService.getAll();
  }

  @Post()
  @ApiCreatedResponse({ description: 'Користувача створено' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
