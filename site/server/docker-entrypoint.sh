#!/bin/sh
set -e

echo "▶ Application du schéma Prisma (db push)…"
# Réessaie tant que la base n'est pas prête (la dépendance healthcheck couvre
# déjà l'essentiel, cette boucle gère le cas où MySQL vient tout juste de démarrer).
#
# Volontairement SANS --accept-data-loss : une modification destructrice du
# schéma (colonne ou table supprimée) fait échouer le démarrage au lieu d'effacer
# silencieusement des données en production. Si un tel changement est voulu, il
# faut passer par des migrations versionnées (voir DEPLOY.md).
until npx prisma db push --skip-generate; do
  echo "  base indisponible ou schéma refusé, nouvelle tentative dans 3 s…"
  sleep 3
done

# Seed uniquement si la base est vierge (aucun compte d'administration),
# afin d'éviter les doublons à chaque redémarrage.
COUNT=$(node -e "import('@prisma/client').then(async (m)=>{const p=new m.PrismaClient();try{process.stdout.write(String(await p.admin.count()))}catch(e){process.stdout.write('err')}finally{await p.\$disconnect()}})")

if [ "$COUNT" = "0" ]; then
  echo "▶ Base vierge → initialisation…"
  node prisma/seed.js
elif [ "$COUNT" = "err" ]; then
  echo "⚠ Impossible de vérifier l'état de la base, initialisation ignorée."
else
  echo "▶ Base déjà initialisée (comptes admin = $COUNT) → initialisation ignorée."
fi

echo "▶ Démarrage du serveur…"
exec node index.js
