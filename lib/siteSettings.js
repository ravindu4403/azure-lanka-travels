import { cleanText, readJson, writeJson } from './jsonDb';

export const defaultSiteSettings = {
  heroTitle: 'Discover The Wild Heart of Sri Lanka',
  heroSubtitle: 'Book premium Yala National Park safari experiences with local experts, comfortable jeeps and fast WhatsApp support.',
  primaryCta: 'Book Your Safari',
  secondaryCta: 'Chat on WhatsApp',
  whatsappNumber: '94700000000',
  bookingEmail: 'bookings@azurelankatravels.com',
  locationText: 'Yala, Tissamaharama & Southern Sri Lanka',
  businessHours: 'Daily · 6.00 AM - 10.00 PM',
  facebookUrl: 'https://facebook.com/',
  instagramUrl: 'https://instagram.com/',
  seoTitle: 'Yala Safari Booking Sri Lanka | Azure Lanka Travels',
  seoDescription: 'Book Yala National Park safaris in Sri Lanka with Azure Lanka Travels. Full-day and half-day jeep safari packages, local guides, wildlife experiences and fast WhatsApp booking.',
  seoKeywords: 'Yala safari booking, Yala National Park safari, Sri Lanka safari tours, Yala jeep safari, Azure Lanka Travels',
  footerCredit: 'Azure Lanka Travels. Crafted for unforgettable Sri Lankan safari journeys.'
};

export async function getSiteSettings() {
  const settings = await readJson('siteSettings', defaultSiteSettings);
  return { ...defaultSiteSettings, ...(settings || {}) };
}

export async function saveSiteSettings(nextSettings = {}) {
  const current = await getSiteSettings();
  const merged = { ...current, ...nextSettings };
  const cleaned = {};

  for (const [key, value] of Object.entries(merged)) {
    cleaned[key] = cleanText(value, defaultSiteSettings[key] || '');
  }

  await writeJson('siteSettings', cleaned);
  return cleaned;
}

export function getWhatsappUrl(settings = {}, message = 'Hello Azure Lanka Travels, I want to book a Yala safari') {
  const number = String(settings.whatsappNumber || defaultSiteSettings.whatsappNumber || '').replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getPublicSiteUrl() {
  return String(process.env.NEXT_PUBLIC_SITE_URL || 'https://azurelankatravels.com').replace(/\/$/, '');
}
