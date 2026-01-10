import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const courts = [
    { name: 'Корт №1 (Хамовники)', location: 'Москва, Хамовники' },
    { name: 'Корт №2 (Парк Горького)', location: 'Москва, Парк Горького' },
    { name: 'Корт №3 (Сокольники)', location: 'Москва, Сокольники' },
    { name: 'Корт №4 (Измайлово)', location: 'Москва, Измайлово' },
    { name: 'Корт №5 (ВДНХ)', location: 'Москва, ВДНХ' },
    { name: 'Корт №6 (Крылатское)', location: 'Москва, Крылатское' },
    { name: 'Корт №7 (Лужники)', location: 'Москва, Лужники' },
    { name: 'Корт №8 (Царицыно)', location: 'Москва, Царицыно' },
    { name: 'Корт №9 (Строгино)', location: 'Москва, Строгино' },
    { name: 'Корт №10 (Таганка)', location: 'Москва, Таганка' }
  ];

  for (const court of courts) {
    const exists = await prisma.court.findFirst({
      where: { name: court.name },
      select: { id: true },
    });
    if (!exists) {
      await prisma.court.create({ data: court });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

