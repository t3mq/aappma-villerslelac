# ── Étape 1 : build du front Vite/React ──
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Le front appelle /api en relatif → aucun VITE_API_URL nécessaire,
# Caddy proxifie /api vers le backend sur le même domaine.
RUN npm run build

# ── Étape 2 : Caddy sert les fichiers statiques + reverse proxy /api + HTTPS auto ──
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
