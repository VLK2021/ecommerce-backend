import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Addresses')
@Controller('users/:userId/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOperation({ summary: 'Список адрес користувача' })
  @ApiOkResponse({ type: [AddressResponseDto] })
  async findAll(
    @Param('userId') userId: string,
  ): Promise<AddressResponseDto[]> {
    return this.addressService.findAllForUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Додати адресу користувачу' })
  @ApiCreatedResponse({ type: AddressResponseDto })
  async create(
    @Param('userId') userId: string,
    @Body() dto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити адресу' })
  @ApiOkResponse({ type: AddressResponseDto })
  async update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити адресу' })
  @ApiOkResponse({ type: AddressResponseDto })
  async remove(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ): Promise<AddressResponseDto> {
    return this.addressService.remove(id, userId);
  }
}
