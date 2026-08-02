# ── Backend : Express + Prisma (MySQL) ──
FROM node:22-slim

# openssl requis par le moteur Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dépendances (cache Docker tant que package*.json ne change pas)
COPY package*.json ./
RUN npm ci

# Code + génération du client Prisma
COPY . .
RUN npx prisma generate

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["docker-entrypoint.sh"]
