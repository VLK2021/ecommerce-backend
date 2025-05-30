import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

type TokenEntry = {
  data: RegisterDto;
  expiresAt: number;
};

@Injectable()
export class TempTokenStore {
  private store = new Map<string, TokenEntry>();

  async set(token: string, data: RegisterDto, ttlMinutes = 15) {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    this.store.set(token, { data, expiresAt });
  }

  async get(token: string): Promise<RegisterDto | null> {
    const entry = this.store.get(token);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(token);
      return null;
    }

    return entry.data;
  }

  async delete(token: string) {
    this.store.delete(token);
  }
}
