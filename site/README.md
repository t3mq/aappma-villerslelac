# Site de l'AAPPMA de Villers-le-Lac

Site vitrine de l'association (actualités, événements, présentation du
territoire) avec un espace d'administration protégé par mot de passe.

## Organisation

```
site/
├── src/              front React (Vite + Tailwind CSS v4 + React Router)
│   ├── components/   en-tête, pied de page, sections de l'accueil, briques admin
│   ├── context/      AuthContext (session) et DataContext (données + API)
│   ├── hooks/        useAsyncAction (appels API avec gestion d'erreur)
│   ├── pages/        pages publiques et pages d'administration
│   └── api.js        client HTTP unique (jeton, erreurs, 401)
├── server/           API Express 5 + Prisma (MySQL)
├── public/photos/    photos servies au public
└── docker-compose.yml
```

## Développement

Deux terminaux, une base MySQL accessible.

```sh
# API — http://localhost:3001
cd server
npm install
cp ../.env.example .env      # renseigner DATABASE_URL, JWT_SECRET, ADMIN_*
npm run db:push
npm run db:seed
npm run dev

# Front — http://localhost:5173
cd ..
npm install
npm run dev
```

Le serveur de développement Vite proxifie `/api` vers `http://localhost:3001` :
aucune variable d'URL à configurer côté front.

Scripts disponibles :

| Commande          | Effet                                   |
|-------------------|-----------------------------------------|
| `npm run dev`     | serveur de développement + rechargement |
| `npm run build`   | build de production dans `dist/`        |
| `npm run preview` | prévisualisation du build               |
| `npm run lint`    | analyse statique (Oxlint)               |

## Contenus

| Section       | Visibilité                                          |
|---------------|-----------------------------------------------------|
| Actualités    | publique — accueil et page `/actualites`            |
| Événements    | publique — page `/evenements`                       |
| Galerie       | administration (les photos publiques sont dans `public/photos`) |
| Documents     | **administration uniquement** — espace de fichiers privé, jamais publié |
| Adhérents     | **administration uniquement**                       |

L'espace documents fonctionne comme un petit explorateur de fichiers : envoi
par glisser-déposer (25 Mo max par fichier, PDF / bureautique / images / zip),
dossiers imbriqués, renommage et déplacement (glisser sur un dossier ou bouton
« Déplacer »). Les fichiers sont stockés dans `UPLOAD_DIR` (volume Docker
`uploads_data`) et ne sont servis qu'aux administrateurs connectés.

Les photos de la galerie restent référencées par leur adresse.

## Mise en production

Voir [DEPLOY.md](./DEPLOY.md).
