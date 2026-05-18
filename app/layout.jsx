import './globals.css';

export const metadata = {
  metadataBase: new URL('https://azurelankatravels.com'),
  title: {
    default: 'Azure Lanka Travels | Yala Safari Booking in Sri Lanka',
    template: '%s | Azure Lanka Travels'
  },
  description:
    'Book premium Yala National Park safari experiences in Sri Lanka with Azure Lanka Travels. Fast WhatsApp booking, local guides, comfortable safari jeeps, wildlife encounters and accommodation request support.',
  keywords: [
    'Yala safari booking',
    'Book Yala safari online',
    'Yala National Park tickets',
    'Yala National Park safari',
    'Sri Lanka safari tours',
    'Yala jeep safari',
    'Sri Lanka wildlife safari',
    'Full day Yala safari',
    'Half day Yala safari'
  ],
  openGraph: {
    title: 'Azure Lanka Travels | Discover the Wild Heart of Sri Lanka',
    description: 'Premium Yala safari bookings for foreign travelers, couples, families and wildlife lovers.',
    url: 'https://azurelankatravels.com',
    siteName: 'Azure Lanka Travels',
    images: [{ url: '/logos/azure-logo-light.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website'
  },
  alternates: { canonical: '/', languages: { 'en': '/', 'fr': '/fr', 'de': '/de', 'pl': '/pl' } },
  twitter: { card: 'summary_large_image', title: 'Azure Lanka Travels | Yala Safari Booking', description: 'Premium Yala safari booking in Sri Lanka for wildlife lovers, families and foreign tourists.', images: ['/logos/azure-logo-light.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
