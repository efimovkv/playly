import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

function buildCorsOptions(config: ConfigService) {
  const originsRaw = config.get<string>('CORS_ORIGINS') ?? '';
  const allowVercel = (config.get<string>('CORS_ALLOW_VERCEL') ?? 'false') === 'true';

  const allowedOrigins = originsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // allow non-browser clients / same-origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (allowVercel && /^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);
  app.enableCors(buildCorsOptions(config));

  const port = Number(config.get('PORT') ?? 3001);
  await app.listen(port);
}

bootstrap();

