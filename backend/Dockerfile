FROM node:20-alpine AS deps
WORKDIR /app

# Workspaces need root lockfile + workspace package.json files
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci


FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY backend ./backend
COPY frontend/package.json ./frontend/package.json

RUN npm --workspace backend run prisma:generate
RUN npm --workspace backend run build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci --omit=dev

COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma

# Generate prisma client in the production node_modules
RUN npm --workspace backend run prisma:generate

EXPOSE 3001
CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]

