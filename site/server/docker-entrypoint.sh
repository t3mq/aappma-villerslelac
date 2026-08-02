#!/bin/sh
set -e

echo "▶ Application du schéma Prisma (db push)…"
# Réessaie tant que la base n'est pas prête (dépendance healthcheck déjà en place,
# cette boucle couvre le cas où MySQL vient tout juste de démarrer).
until npx prisma db push --skip-generate --accept-data-loss; do
  echo "  base indisponible, nouvelle tentative dans 3s…"
  sleep 3
done

# Seed uniquement si la base est vierge (aucun admin) → évite les doublons au redémarrage.
COUNT=$(node -e "import('@prisma/client').then(async (m)=>{const p=new m.PrismaClient();try{process.stdout.write(String(await p.admin.count()))}catch(e){process.stdout.write('err')}finally{await p.\$disconnect()}})")

if [ "$COUNT" = "0" ]; then
  echo "▶ Base vierge → seed initial…"
  node prisma/seed.js
elif [ "$COUNT" = "err" ]; then
  echo "⚠ Impossible de vérifier l'état de la base, seed ignoré."
else
  echo "▶ Base déjà initialisée (admins=$COUNT) → seed ignoré."
fi

echo "▶ Démarrage du serveur…"
exec node index.js
