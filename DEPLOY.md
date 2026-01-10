# Деплой на VPS (Docker Compose + Nginx)

Цель: поднять **Postgres + NestJS backend + Next.js frontend** за Nginx на одном домене.  
Backend доступен как **`/api/*`**, frontend — по корню **`/`**.

## Требования

- Ubuntu/Debian VPS
- Установлены `docker` и `docker compose`

## Шаги

1) **Скопируйте проект на сервер**

Например, через git:

```bash
git clone <ваш-репозиторий> app
cd app
```

2) **Проверьте секреты**

В `docker-compose.prod.yml` обязательно поменяйте:
- `JWT_SECRET` (не оставляйте `change-me`)
- `CORS_ORIGINS` на ваш домен (например `https://example.com`)

3) **Запуск**

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

4) **Проверка**

- Откройте сайт по IP/домену (порт 80)
- API: `GET /api/courts` (должно отвечать JSON)

## Данные/миграции

При старте контейнера backend выполняет:

```bash
prisma migrate deploy
prisma db seed
```

База хранится в volume `pgdata`.

Seed добавляет:
- 10 кортов в Москве
- ADMIN пользователя `admin@example.com` / `admin123`

## HTTPS (рекомендовано)

Самый простой вариант — поставить Caddy или Traefik перед Nginx, либо заменить Nginx на Caddy с авто-HTTPS.
Если хотите — скажите домен и чем управляете сервером (nginx/caddy/traefik), я подготовлю конфиг под ваш кейс.

