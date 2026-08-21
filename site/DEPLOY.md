# Déploiement sur VPS

Le site tourne en 3 conteneurs Docker orchestrés par `docker-compose.yml` :

| Service  | Rôle                                                             |
|----------|------------------------------------------------------------------|
| `db`     | Base MySQL 8 (données persistées dans le volume `db_data`)        |
| `server` | API Express + Prisma (port interne 3001)                         |
| `web`    | Build React servi par Caddy — HTTPS automatique + proxy `/api`    |

## Prérequis sur le VPS

1. **Docker + plugin compose** installés
   ```sh
   curl -fsSL https://get.docker.com | sh
   ```
2. **DNS** : les enregistrements A (et AAAA si IPv6) de `aappmavillerslelac.fr`
   **et** `www.aappmavillerslelac.fr` pointent vers l'IP du VPS.
3. **Ports 80 et 443 ouverts** (pare-feu / groupe de sécurité).
   Caddy en a besoin pour obtenir le certificat Let's Encrypt.

## Mise en ligne

```sh
# 1. Récupérer le code sur le VPS (git clone / scp) puis :
cd site

# 2. Créer le fichier d'environnement à partir du modèle
cp .env.example .env
nano .env         # ⚠ changer TOUS les mots de passe + JWT_SECRET

# 3. Lancer (build + démarrage en arrière-plan)
docker compose up -d --build

# 4. Suivre les logs (obtention du certificat HTTPS, initialisation…)
docker compose logs -f
```

Si une variable obligatoire manque dans `.env`, `docker compose` s'arrête
immédiatement avec un message explicite plutôt que de démarrer la pile avec
des mots de passe vides.

Au premier démarrage, l'API :
- crée les tables (Prisma `db push`) ;
- crée le compte d'administration à partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD` ;
- insère les contenus de démonstration **uniquement** si `SEED_DEMO_DATA=true` ;
- puis Caddy obtient le certificat HTTPS (quelques secondes).

Le site est alors accessible sur **https://aappmavillerslelac.fr**
et l'administration sur **https://aappmavillerslelac.fr/admin/login**.

## Sécurité

- **`JWT_SECRET` est obligatoire.** L'API refuse de démarrer sans lui : il n'y a
  aucune valeur de repli, un secret par défaut connu permettrait de forger des
  jetons d'administration. Générer une valeur forte :
  ```sh
  openssl rand -hex 32
  ```
- **Compte d'administration** : défini par `ADMIN_EMAIL` / `ADMIN_PASSWORD`,
  jamais écrit en dur dans le code. Il est créé au premier démarrage ; pour
  changer le mot de passe ensuite, modifier `ADMIN_PASSWORD` puis relancer
  l'initialisation :
  ```sh
  docker compose exec server node prisma/seed.js
  ```
- **Mots de passe MySQL forts** dans `.env`, différents de celui de `root`.
- **`SEED_DEMO_DATA` doit rester à `false` en production** : les contenus de
  démonstration comportent des adhérents et des adresses e-mail fictifs.
- Les tentatives de connexion sont limitées à 10 par quart d'heure et par
  adresse IP.
- `.env` n'est jamais committé (ignoré par Git) ni copié dans les images
  Docker (ignoré par `.dockerignore`).

## Commandes utiles

```sh
docker compose ps                 # état des conteneurs
docker compose logs -f server     # logs de l'API
docker compose restart server     # redémarrer l'API
docker compose down               # tout arrêter (les volumes/données restent)
docker compose up -d --build      # redéployer après une mise à jour du code

curl -s https://aappmavillerslelac.fr/api/health   # {"status":"ok"}

# Sauvegarde de la base
docker compose exec db mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" aappma > backup.sql
```

## Évolution du schéma de base

Le conteneur `server` applique le schéma avec `prisma db push`, **sans**
`--accept-data-loss` : une modification destructrice (colonne ou table
supprimée) fait échouer le démarrage au lieu d'effacer des données. Les
ajouts de champs, eux, passent tout seuls.

Pour un suivi plus rigoureux (historique, retour arrière), passer aux
migrations versionnées :

```sh
# En local, sur une base de développement
cd server
npx prisma migrate dev --name description-du-changement

# Sur le VPS, avec une base déjà créée par db push : la déclarer conforme
# à la migration initiale une seule fois, avant tout `migrate deploy`.
docker compose exec server npx prisma migrate resolve --applied 0_init
```

Puis remplacer `prisma db push --skip-generate` par `prisma migrate deploy`
dans `server/docker-entrypoint.sh`.

## Notes

- Les données restent dans les volumes Docker (`db_data`) même après `down`.
  Pour tout effacer (⚠ perte de données) : `docker compose down -v`.
- Les certificats TLS sont persistés dans le volume `caddy_data` → pas de
  réémission à chaque redémarrage (utile face aux limites de Let's Encrypt).
- Le service `web` attend que l'API réponde sur `/api/health` avant de démarrer.
- Le front appelle l'API en relatif (`/api`) : aucun réglage d'URL à faire,
  tout passe par le même domaine via Caddy.
