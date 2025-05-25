import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { UserEntity } from '../users/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Користувача зареєстровано',
    type: TokenResponseDto,
  })
  register(@Body() dto: RegisterDto): Promise<TokenResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Успішний логін',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Невірні облікові дані' })
  login(@Body() dto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Оновлені токени',
    type: TokenResponseDto,
  })
  refresh(@Req() req: any): Promise<TokenResponseDto> {
    const user = req.user;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    const refreshToken = authHeader.split(' ')[1];
    return this.authService.refreshTokens(user.sub, refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Поточний користувач',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Неавторизовано' })
  getMe(@Req() req: any): UserEntity {
    return req.user;
  }
}
