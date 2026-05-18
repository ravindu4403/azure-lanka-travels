export const reviewRecords = [
  {
    id: 'REV-1001',
    name: 'Emily Carter',
    country: 'United Kingdom',
    rating: 5,
    text: 'A beautifully organized safari. The team replied fast, the jeep was comfortable, and our guide knew exactly where to go.',
    status: 'approved',
    source: 'Website',
    submittedAt: '2026-05-07'
  },
  {
    id: 'REV-1002',
    name: 'Jonas Weber',
    country: 'Germany',
    rating: 5,
    text: 'Professional, calm, and very friendly. We saw elephants, crocodiles, many birds, and finally a leopard.',
    status: 'approved',
    source: 'Google',
    submittedAt: '2026-05-08'
  },
  {
    id: 'REV-1003',
    name: 'Marie Dupont',
    country: 'France',
    rating: 5,
    text: 'The booking was simple and the safari felt safe from start to finish. Perfect for our family trip.',
    status: 'approved',
    source: 'Website',
    submittedAt: '2026-05-09'
  },
  {
    id: 'REV-1004',
    name: 'Anna Kowalska',
    country: 'Poland',
    rating: 5,
    text: 'Our morning safari was peaceful, safe and full of beautiful wildlife. The WhatsApp support made everything easy.',
    status: 'pending',
    source: 'Website',
    submittedAt: '2026-05-12'
  },
  {
    id: 'REV-1005',
    name: 'Sofia Müller',
    country: 'Switzerland',
    rating: 4,
    text: 'Very clean jeep and a warm local team. We would love to come again for a full-day safari next time.',
    status: 'pending',
    source: 'Website',
    submittedAt: '2026-05-12'
  }
];

export const approvedReviews = reviewRecords.filter((review) => review.status === 'approved');
