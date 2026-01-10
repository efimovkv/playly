import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from '@/prisma/prisma.service';
import { MOSCOW_TZ, parseMoscowDate } from '@/time/moscow';

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.court.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, location: true, createdAt: true },
    });
  }

  create(data: { name: string; location: string }) {
    return this.prisma.court.create({
      data,
      select: { id: true, name: true, location: true, createdAt: true },
    });
  }

  async update(id: string, data: { name?: string; location?: string }) {
    try {
      return await this.prisma.court.update({
        where: { id },
        data,
        select: { id: true, name: true, location: true, createdAt: true },
      });
    } catch (e: any) {
      // Prisma throws if record not found
      throw new NotFoundException('Корт не найден');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.court.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      throw new NotFoundException('Корт не найден');
    }
  }

  async availability(courtId: string, date: string) {
    const day = parseMoscowDate(date);
    if (!day.isValid) throw new BadRequestException('Неверный формат date, ожидается YYYY-MM-DD');

    const court = await this.prisma.court.findUnique({ where: { id: courtId }, select: { id: true } });
    if (!court) throw new NotFoundException('Корт не найден');

    const rangeStart = day.set({ hour: 7, minute: 0, second: 0, millisecond: 0 });
    const rangeEnd = day.plus({ days: 1 }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const bookings = await this.prisma.booking.findMany({
      where: {
        courtId,
        startAt: {
          gte: rangeStart.toUTC().toJSDate(),
          lt: rangeEnd.toUTC().toJSDate(),
        },
      },
      select: { startAt: true },
    });

    const bookedStartTimes = new Set(
      bookings.map((b) => DateTime.fromJSDate(b.startAt, { zone: 'utc' }).setZone(MOSCOW_TZ).toISO()),
    );

    const slots: Array<{
      startAt: string;
      endAt: string;
      label: string;
      isAvailable: boolean;
    }> = [];

    for (let hour = 7; hour <= 23; hour += 1) {
      const start = day.set({ hour, minute: 0, second: 0, millisecond: 0 });
      const end = start.plus({ hours: 1 });
      const key = start.toISO();

      slots.push({
        startAt: start.toUTC().toISO()!,
        endAt: end.toUTC().toISO()!,
        label: start.toFormat('HH:mm'),
        isAvailable: !bookedStartTimes.has(key),
      });
    }

    return {
      date,
      slots,
    };
  }
}

