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
COPY backend/package.json ./backend/package.json
COPY frontend ./frontend

RUN npm --workspace frontend run build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Workspaces need root lockfile + workspace package.json files
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci --omit=dev

COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public

EXPOSE 3000
CMD ["sh", "-c", "cd frontend && npx next start -p 3000"]

