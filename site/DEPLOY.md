# Déploiement sur VPS

Le site tourne en 3 conteneurs Docker orchestrés par `docker-compose.yml` :

| Service  | Rôle                                                             |
|----------|-----------------------------------------------------------------|
| `db`     | Base MySQL 8 (données persistées dans le volume `db_data`)       |
| `server` | API Express + Prisma (port interne 3001)                        |
| `web`    | Build React servi par Caddy — HTTPS auto + proxy `/api`         |

## Prérequis sur le VPS

1. **Docker + plugin compose** installés
   ```sh
   curl -fsSL https://get.docker.com | sh
   ```
2. **DNS** : les enregistrements A (et AAAA si IPv6) de `aappmavillerslelac.fr`
   **et** `www.aappmavillerslelac.fr` pointent vers l'IP du VPS.
3. **Ports 80 et 443 ouverts** (pare-feu / groupe de sécurité).
   Caddy en a besoin pour générer le certificat Let's Encrypt.

## Mise en ligne

```sh
# 1. Récupérer le code sur le VPS (git clone / scp) puis :
cd site

# 2. Créer le fichier d'environnement à partir du modèle
cp .env.example .env
nano .env         # ⚠ changer TOUS les mots de passe + JWT_SECRET

# 3. Lancer (build + démarrage en arrière-plan)
docker compose up -d --build

# 4. Suivre les logs (obtention du certificat HTTPS, seed initial…)
docker compose logs -f
```

Le premier démarrage :
- crée les tables (Prisma `db push`),
- insère les données de démo **une seule fois** (seed ignoré aux redémarrages suivants),
- obtient le certificat HTTPS (quelques secondes).

Le site est alors accessible sur **https://aappmavillerslelac.fr**
et l'admin sur **https://aappmavillerslelac.fr/admin/login**.

## Sécurité — à faire avant la vraie mise en ligne

- Définir le compte admin dans `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
  Aucun identifiant n'est stocké dans le code : le compte est créé au premier
  démarrage à partir de ces variables. Changer le mot de passe **après coup** se
  fait depuis l'admin (ou en resaisissant `ADMIN_PASSWORD` puis en relançant le seed).
- Mettre un `JWT_SECRET` aléatoire fort : `openssl rand -hex 32`.
- Mots de passe MySQL forts dans `.env`.

## Commandes utiles

```sh
docker compose ps                 # état des conteneurs
docker compose logs -f server     # logs de l'API
docker compose restart server     # redémarrer l'API
docker compose down               # tout arrêter (les volumes/données restent)
docker compose up -d --build      # redéployer après une mise à jour du code

# Sauvegarde de la base
docker compose exec db mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" aappma > backup.sql
```

## Notes

- Les données restent dans les volumes Docker (`db_data`) même après `down`.
  Pour tout effacer (⚠ perte de données) : `docker compose down -v`.
- Les certificats TLS sont persistés dans le volume `caddy_data` → pas de
  re-émission à chaque redémarrage (utile face aux limites Let's Encrypt).
- Le front appelle l'API en relatif (`/api`) : aucun réglage d'URL à faire,
  tout passe par le même domaine via Caddy.
