import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/prisma/prisma.service';
import type { AuthUser, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string): Promise<{ accessToken: string }> {
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const user = await this.prisma.user.create({
        data: { email, passwordHash, role: Role.USER },
        select: { id: true, email: true, role: true },
      });
      return { accessToken: await this.sign(user) };
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
      throw e;
    }
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, passwordHash: true },
    });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Неверный email или пароль');

    const { passwordHash, ...safe } = user;
    return { accessToken: await this.sign(safe) };
  }

  async me(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  private async sign(user: AuthUser): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return this.jwt.signAsync(payload);
  }
}

