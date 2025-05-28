import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
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
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // ❗ локально має бути false
      sameSite: 'lax', // ❗ не strict
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    });

    return { accessToken };
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Успішний логін',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Невірні облікові дані' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // ❗ локально має бути false
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Оновлені токени',
    type: TokenResponseDto,
  })
  async refresh(@Req() req: any): Promise<TokenResponseDto> {
    const user = req.user;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const token = authHeader.split(' ')[1];
    return this.authService.refreshTokens(user.sub, token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const userId = req.user.sub;

    res.clearCookie('refreshToken', {
      path: '/auth/refresh',
      sameSite: 'lax',
      secure: false,
    });

    return this.authService.logout(userId);
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

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Адмінська дія' })
  getAdminStuff() {
    return { message: 'Only for admins' };
  }
}
