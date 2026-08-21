import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Les actualités, événements, documents, adhérents et photos ci-dessous ne sont
// que des exemples de démonstration. Ils ne sont insérés que si SEED_DEMO_DATA
// vaut "true" : une mise en production part ainsi d'un site vide, sans contenus
// fictifs ni adhérents inventés.
const withDemoData = process.env.SEED_DEMO_DATA === 'true';

async function main() {
  // Compte d'administration — identifiants fournis par l'environnement,
  // jamais écrits en dur dans le code.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis (voir .env).');
  }

  const hash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hash },
    create: { email: adminEmail, password: hash },
  });
  console.log(`✓ Compte d'administration prêt : ${adminEmail}`);

  if (!withDemoData) {
    console.log('▶ SEED_DEMO_DATA absent ou différent de "true" → aucune donnée de démonstration insérée.');
    return;
  }

  // ── Actualités ──
  const newsData = [
    {
      title: 'Ouverture de la truite 2026',
      date: '2026-03-14',
      excerpt:
        'La saison de la truite ouvre ses portes le 14 mars. Retrouvez toutes les infos pratiques pour bien démarrer la saison sur nos parcours.',
      content:
        "La saison de la truite ouvre ses portes le 14 mars. Retrouvez toutes les infos pratiques pour bien démarrer la saison sur nos parcours du Doubs et du Dessoubre. Les conditions s'annoncent bonnes avec un niveau d'eau favorable. N'oubliez pas votre carte de pêche à jour !",
      image: '/photos/PHOTO-2025-02-01-14-52-27.jpg',
    },
    {
      title: 'Nettoyage des berges : bilan record',
      date: '2026-04-20',
      excerpt:
        'Plus de 400 kg de déchets collectés lors de notre journée annuelle de nettoyage des berges du Doubs. Merci à tous les bénévoles !',
      content:
        'Plus de 400 kg de déchets collectés lors de notre journée annuelle de nettoyage des berges du Doubs. Un record cette année grâce à la mobilisation de 35 bénévoles. Plastiques, ferrailles, pneus… tout y était. Un grand merci à tous les participants !',
      image: '/photos/PHOTO-2025-11-15-10-26-58.jpg',
    },
    {
      title: 'Travaux du local : les fenêtres sont posées',
      date: '2026-06-01',
      excerpt:
        "L'aménagement de notre local avance bien. Les nouvelles fenêtres ont été installées ce week-end par nos bénévoles.",
      content:
        "L'aménagement de notre local avance bien. Les nouvelles fenêtres double vitrage ont été installées ce week-end par une équipe de bénévoles motivés. Prochaine étape : l'isolation et l'électricité. Le local devrait être opérationnel pour l'automne.",
      image: '/photos/PHOTO-2025-05-24-12-41-28.jpg',
    },
    {
      title: 'Alevinage de printemps réussi',
      date: '2026-05-10',
      excerpt:
        '5 000 truitelles fario de souche locale ont été relâchées dans le Doubs et ses affluents. Un geste essentiel pour la préservation.',
      content:
        '5 000 truitelles fario de souche locale ont été relâchées dans le Doubs et ses affluents lors de notre alevinage de printemps. Cette opération, menée en partenariat avec la fédération de pêche du Doubs, vise à soutenir les populations naturelles tout en respectant la génétique locale.',
      image: '/photos/PHOTO-2024-11-03-11-12-48.jpg',
    },
  ];

  for (const item of newsData) {
    await prisma.news.create({ data: item });
  }

  // ── Événements ──
  const eventsData = [
    {
      title: 'Concours de pêche à la mouche',
      date: '2026-08-15',
      description:
        'Concours amical ouvert à tous les adhérents. Parcours no-kill sur le Doubs, secteur des gorges. Inscription au local.',
    },
    {
      title: 'Assemblée générale annuelle',
      date: '2026-11-22',
      description:
        'Bilan de l’année, présentation des comptes et élection du bureau. Suivie du traditionnel repas convivial.',
    },
    {
      title: 'Journée nettoyage des berges',
      date: '2026-09-28',
      description:
        'Rendez-vous annuel pour nettoyer les rives du Doubs et du lac. Gants et sacs fournis, bonne humeur obligatoire.',
    },
    {
      title: 'Fermeture de la truite',
      date: '2026-09-21',
      description: 'Dernier jour de pêche en 1re catégorie pour la saison 2026. Profitez-en bien !',
    },
    {
      title: 'Sortie découverte pour les jeunes',
      date: '2026-07-19',
      description:
        'Initiation à la pêche pour les 8-14 ans au bord du lac. Matériel prêté, encadrement assuré par nos bénévoles.',
    },
  ];

  for (const item of eventsData) {
    await prisma.event.create({ data: item });
  }

  // ── Documents ──
  const docsData = [
    { title: 'Règlement intérieur 2026', category: 'Règlement', filename: 'reglement-interieur-2026.pdf' },
    { title: 'Carte des parcours de pêche', category: 'Cartes', filename: 'carte-parcours.pdf' },
    { title: 'Compte rendu de l’AG 2025', category: 'Comptes rendus', filename: 'cr-ag-2025.pdf' },
    { title: 'Tarifs des cartes de pêche 2026', category: 'Cartes', filename: 'tarifs-cartes-2026.pdf' },
    { title: 'Arrêté préfectoral pêche 2026', category: 'Règlement', filename: 'arrete-prefectoral-2026.pdf' },
  ];

  for (const item of docsData) {
    await prisma.document.create({ data: item });
  }

  // ── Adhérents ──
  const membersData = [
    { name: 'Jean Dupont', email: 'jean.dupont@exemple.fr', role: 'Président', cotisation: true },
    { name: 'Pierre Martin', email: 'pierre.martin@exemple.fr', role: 'Trésorier', cotisation: true },
    { name: 'Marie Leroy', email: 'marie.leroy@exemple.fr', role: 'Secrétaire', cotisation: true },
    { name: 'Luc Bernard', email: 'luc.bernard@exemple.fr', role: 'Membre', cotisation: false },
    { name: 'Sophie Morel', email: 'sophie.morel@exemple.fr', role: 'Membre', cotisation: true },
  ];

  for (const item of membersData) {
    await prisma.member.create({ data: item });
  }

  // ── Galerie ──
  const photosData = [
    { src: '/photos/PHOTO-2025-02-01-14-05-07.jpg', alt: 'Gorges du Doubs' },
    { src: '/photos/PHOTO-2025-02-01-14-01-52.jpg', alt: 'Pas japonais' },
    { src: '/photos/PHOTO-2025-02-01-14-52-27.jpg', alt: 'Truite fario' },
    { src: '/photos/PHOTO-2025-02-01-14-06-44.jpg', alt: 'Sentier du Doubs' },
    { src: '/photos/PHOTO-2025-02-01-13-53-18.jpg', alt: 'Vue du lac' },
    { src: '/photos/PHOTO-2025-02-01-14-02-29.jpg', alt: 'Méandre' },
    { src: '/photos/PHOTO-2024-11-03-12-00-17.jpg', alt: 'Sortie conviviale' },
    { src: '/photos/PHOTO-2025-02-15-13-10-36.jpg', alt: 'Truite' },
  ];

  for (const item of photosData) {
    await prisma.photo.create({ data: item });
  }

  console.log('✓ Données de démonstration insérées.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
