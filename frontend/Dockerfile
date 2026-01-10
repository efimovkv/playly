FROM node:20-alpine AS deps
WORKDIR /app

# Workspaces need root lockfile + workspace package.json files
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci


FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend ./frontend

RUN npm --workspace frontend run build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Standalone output contains server.js + minimal node_modules
COPY --from=build /app/frontend/.next/standalone ./
COPY --from=build /app/frontend/.next/static ./frontend/.next/static
COPY --from=build /app/frontend/public ./frontend/public

EXPOSE 3000
CMD ["node", "frontend/server.js"]

