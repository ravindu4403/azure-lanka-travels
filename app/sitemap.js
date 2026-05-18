export default function sitemap() {
  const base = 'https://azurelankatravels.com';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/#packages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/#gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/yala-safari-booking`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/full-day-yala-safari`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/half-day-yala-safari`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.88 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.82 },
    { url: `${base}/accommodation-request`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.78 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.86 },
    { url: `${base}/blog/best-time-to-book-yala-safari`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/full-day-vs-half-day-yala-safari`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }
  ];
}
