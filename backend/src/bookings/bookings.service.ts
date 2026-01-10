import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DateTime } from 'luxon';
import { PrismaService } from '@/prisma/prisma.service';
import { MOSCOW_TZ } from '@/time/moscow';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, courtId: string, startAtIso: string) {
    const startUtc = DateTime.fromISO(startAtIso, { zone: 'utc' });
    if (!startUtc.isValid) throw new BadRequestException('Неверный формат startAt, ожидается ISO-строка');

    const nowUtc = DateTime.utc();
    const maxUtc = nowUtc.plus({ hours: 24 });
    if (startUtc < nowUtc) throw new BadRequestException('startAt должен быть в будущем');
    if (startUtc > maxUtc) throw new BadRequestException('Бронь можно делать максимум за 24 часа вперёд');

    const startMsk = startUtc.setZone(MOSCOW_TZ);
    if (startMsk.minute !== 0 || startMsk.second !== 0 || startMsk.millisecond !== 0) {
      throw new BadRequestException('Слот должен начинаться ровно в час (минуты/секунды = 00)');
    }
    if (startMsk.hour < 7 || startMsk.hour > 23) {
      throw new BadRequestException('Слот должен быть в интервале 07:00–00:00 (последний старт в 23:00)');
    }

    const endUtc = startUtc.plus({ hours: 1 });

    const court = await this.prisma.court.findUnique({ where: { id: courtId }, select: { id: true } });
    if (!court) throw new NotFoundException('Корт не найден');

    try {
      return await this.prisma.booking.create({
        data: {
          courtId,
          userId,
          startAt: startUtc.toJSDate(),
          endAt: endUtc.toJSDate(),
        },
        select: {
          id: true,
          courtId: true,
          userId: true,
          startAt: true,
          endAt: true,
          createdAt: true,
          court: { select: { id: true, name: true, location: true } },
        },
      });
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Этот слот уже занят');
      }
      throw e;
    }
  }

  my(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { startAt: 'asc' },
      select: {
        id: true,
        courtId: true,
        startAt: true,
        endAt: true,
        createdAt: true,
        court: { select: { id: true, name: true, location: true } },
      },
    });
  }

  all() {
    return this.prisma.booking.findMany({
      orderBy: { startAt: 'asc' },
      select: {
        id: true,
        courtId: true,
        userId: true,
        startAt: true,
        endAt: true,
        createdAt: true,
        court: { select: { id: true, name: true, location: true } },
        user: { select: { id: true, email: true, role: true } },
      },
    });
  }

  async cancel(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true },
    });
    if (!booking) throw new NotFoundException('Бронь не найдена');
    if (booking.userId !== userId) throw new ForbiddenException('Можно отменять только свои брони');

    await this.prisma.booking.delete({ where: { id: bookingId } });
    return { ok: true };
  }
}

