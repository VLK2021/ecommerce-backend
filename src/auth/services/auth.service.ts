import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { TempTokenStore } from '../temp-token-store';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
    private emailService: EmailService,
    private tempTokenStore: TempTokenStore,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const token = randomUUID();
    await this.tempTokenStore.set(token, dto);
    await this.emailService.sendVerificationEmail(dto.email, token);

    return { message: 'Лист з підтвердженням надіслано на вашу пошту' };
  }

  async verifyEmail(token: string) {
    const dto = await this.tempTokenStore.get(token);
    if (!dto) throw new BadRequestException('Недійсний або протермінований токен');

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Користувач вже існує');

    const user = await this.usersService.create(dto);
    await this.tempTokenStore.delete(token);
    return this.getTokensAndStoreRefresh(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return this.getTokensAndStoreRefresh(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Access Denied');

    const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isValid) throw new UnauthorizedException('Access Denied');

    return this.getTokensAndStoreRefresh(user);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Вийшли успішно' };
  }

  private async getTokensAndStoreRefresh(user: User) {
    const tokens = await this.generateTokens(user);
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefresh);
    return tokens;
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET!,
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET!,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
