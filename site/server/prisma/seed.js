import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user — identifiants fournis par l'environnement, jamais en dur dans le code.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent etre definis (voir .env).');
  }
  const hash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hash },
    create: { email: adminEmail, password: hash },
  });

  // News
  const newsData = [
    {
      title: 'Ouverture de la truite 2026',
      date: '2026-03-14',
      excerpt: 'La saison de la truite ouvre ses portes le 14 mars. Retrouvez toutes les infos pratiques pour bien demarrer la saison sur nos parcours.',
      content: "La saison de la truite ouvre ses portes le 14 mars. Retrouvez toutes les infos pratiques pour bien demarrer la saison sur nos parcours du Doubs et du Dessoubre. Les conditions s'annoncent bonnes avec un niveau d'eau favorable. N'oubliez pas votre carte de peche a jour !",
      image: '/photos/PHOTO-2025-02-01-14-52-27.jpg',
    },
    {
      title: 'Nettoyage des berges : bilan record',
      date: '2026-04-20',
      excerpt: 'Plus de 400 kg de dechets collectes lors de notre journee annuelle de nettoyage des berges du Doubs. Merci a tous les benevoles !',
      content: 'Plus de 400 kg de dechets collectes lors de notre journee annuelle de nettoyage des berges du Doubs. Un record cette annee grace a la mobilisation de 35 benevoles. Plastiques, ferrailles, pneus... tout y etait. Un grand merci a tous les participants !',
      image: '/photos/PHOTO-2025-11-15-10-26-58.jpg',
    },
    {
      title: 'Travaux du local : les fenetres sont posees',
      date: '2026-06-01',
      excerpt: "L'amenagement de notre local avance bien. Les nouvelles fenetres ont ete installees ce week-end par nos benevoles.",
      content: "L'amenagement de notre local avance bien. Les nouvelles fenetres double vitrage ont ete installees ce week-end par une equipe de benevoles motives. Prochaine etape : l'isolation et l'electricite. Le local devrait etre operationnel pour l'automne.",
      image: '/photos/PHOTO-2025-05-24-12-41-28.jpg',
    },
    {
      title: 'Alevinage de printemps reussi',
      date: '2026-05-10',
      excerpt: '5000 truitelles fario de souche locale ont ete relachees dans le Doubs et ses affluents. Un geste essentiel pour la preservation.',
      content: '5000 truitelles fario de souche locale ont ete relachees dans le Doubs et ses affluents lors de notre alevinage de printemps. Cette operation, menee en partenariat avec la federation de peche du Doubs, vise a soutenir les populations naturelles tout en respectant la genetique locale.',
      image: '/photos/PHOTO-2024-11-03-11-12-48.jpg',
    },
  ];

  for (const item of newsData) {
    await prisma.news.create({ data: item });
  }

  // Events
  const eventsData = [
    { title: 'Concours de peche a la mouche', date: '2026-08-15', description: 'Concours amical ouvert a tous les adherents. Parcours no-kill sur le Doubs, secteur des gorges. Inscription au local.' },
    { title: 'Assemblee generale annuelle', date: '2026-11-22', description: 'Bilan de l\'annee, presentation des comptes et election du bureau. Suivie du traditionnel repas convivial.' },
    { title: 'Journee nettoyage des berges', date: '2026-09-28', description: 'Rendez-vous annuel pour nettoyer les rives du Doubs et du lac. Gants et sacs fournis, bonne humeur obligatoire.' },
    { title: 'Fermeture de la truite', date: '2026-09-21', description: 'Dernier jour de peche en 1ere categorie pour la saison 2026. Profitez-en bien !' },
    { title: 'Sortie decouverte pour les jeunes', date: '2026-07-19', description: 'Initiation a la peche pour les 8-14 ans au bord du lac. Materiel prete, encadrement assure par nos benevoles.' },
  ];

  for (const item of eventsData) {
    await prisma.event.create({ data: item });
  }

  // Documents
  const docsData = [
    { title: 'Reglement interieur 2026', category: 'Reglement', filename: 'reglement-interieur-2026.pdf' },
    { title: 'Carte des parcours de peche', category: 'Cartes', filename: 'carte-parcours.pdf' },
    { title: 'Compte-rendu AG 2025', category: 'Comptes-rendus', filename: 'cr-ag-2025.pdf' },
    { title: 'Tarifs des cartes de peche 2026', category: 'Cartes', filename: 'tarifs-cartes-2026.pdf' },
    { title: 'Arrete prefectoral peche 2026', category: 'Reglement', filename: 'arrete-prefectoral-2026.pdf' },
  ];

  for (const item of docsData) {
    await prisma.document.create({ data: item });
  }

  // Members
  const membersData = [
    { name: 'Jean Dupont', email: 'jean.dupont@email.fr', role: 'President', cotisation: true },
    { name: 'Pierre Martin', email: 'pierre.martin@email.fr', role: 'Tresorier', cotisation: true },
    { name: 'Marie Leroy', email: 'marie.leroy@email.fr', role: 'Secretaire', cotisation: true },
    { name: 'Luc Bernard', email: 'luc.bernard@email.fr', role: 'Membre', cotisation: false },
    { name: 'Sophie Morel', email: 'sophie.morel@email.fr', role: 'Membre', cotisation: true },
  ];

  for (const item of membersData) {
    await prisma.member.create({ data: item });
  }

  // Gallery
  const photosData = [
    { src: '/photos/PHOTO-2025-02-01-14-05-07.jpg', alt: 'Gorges du Doubs' },
    { src: '/photos/PHOTO-2025-02-01-14-01-52.jpg', alt: 'Pas japonais' },
    { src: '/photos/PHOTO-2025-02-01-14-52-27.jpg', alt: 'Truite fario' },
    { src: '/photos/PHOTO-2025-02-01-14-06-44.jpg', alt: 'Sentier du Doubs' },
    { src: '/photos/PHOTO-2025-02-01-13-53-18.jpg', alt: 'Vue du lac' },
    { src: '/photos/PHOTO-2025-02-01-14-02-29.jpg', alt: 'Meandre' },
    { src: '/photos/PHOTO-2024-11-03-12-00-17.jpg', alt: 'Sortie conviviale' },
    { src: '/photos/PHOTO-2025-02-15-13-10-36.jpg', alt: 'Truite' },
  ];

  for (const item of photosData) {
    await prisma.photo.create({ data: item });
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
