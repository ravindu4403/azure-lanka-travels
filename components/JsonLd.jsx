import { faqs } from './FAQSection';

export default function JsonLd({ settings }) {
  const domain = settings?.domain || 'https://azurelankatravels.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': `${domain}/#travelagency`,
        name: settings?.siteName || 'Azure Lanka Travels',
        url: domain,
        email: settings?.email || 'bookings@azurelankatravels.com',
        telephone: settings?.whatsappNumber ? `+${settings.whatsappNumber}` : undefined,
        areaServed: ['Yala National Park', 'Sri Lanka'],
        description: settings?.metaDescription || 'Sri Lanka tourism and safari service company focused on Yala National Park safaris, safari guiding, jeep bookings, and accommodation assistance.',
      },
      {
        '@type': 'TouristTrip',
        name: 'Yala National Park Safari',
        touristType: ['Foreign tourists', 'Wildlife travelers', 'Adventure travelers', 'Couples', 'Families'],
        provider: { '@id': `${domain}/#travelagency` },
        itinerary: 'Yala National Park wildlife safari by jeep',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
