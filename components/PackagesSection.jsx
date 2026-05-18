'use client';

import { useEffect, useState } from 'react';

const fallbackPackages = [
  {
    id: 'PKG-01',
    badge: 'Most Popular • Best Value',
    title: 'Full-Day Yala Safari',
    price: '$120',
    oldPrice: '$150',
    discountPercent: '20% OFF',
    duration: '10–12 hours',
    capacity: '6 per jeep',
    visibility: 'Published',
    text: 'Spend the entire day inside Yala with sunrise and golden-hour wildlife opportunities. Ideal for photographers and serious wildlife lovers.',
    includes: ['Private safari jeep', 'Experienced local guide', 'Morning & evening wildlife drives', 'Pickup support on request'],
  },
  {
    id: 'PKG-02',
    badge: 'Early Morning Adventure',
    title: 'Half-Day Morning Safari',
    price: '$70',
    oldPrice: '$85',
    discountPercent: '18% OFF',
    duration: '4–5 hours',
    capacity: '6 per jeep',
    visibility: 'Published',
    text: 'A focused morning safari for travelers who want fresh tracks, cooler weather, and a higher chance of active wildlife.',
    includes: ['Morning entry planning', 'Comfortable jeep', 'Wildlife route guidance', 'WhatsApp support'],
  },
  {
    id: 'PKG-03',
    badge: 'Golden Hour Drive',
    title: 'Half-Day Evening Safari',
    price: '$70',
    oldPrice: '$85',
    discountPercent: '18% OFF',
    duration: '4–5 hours',
    capacity: '6 per jeep',
    visibility: 'Published',
    text: 'A relaxed afternoon safari ending with beautiful warm light, birdlife, deer, elephants, and possible leopard movement.',
    includes: ['Afternoon jeep safari', 'Sunset photography moments', 'Local guide support', 'Easy booking flow'],
  },
];

const defaultIncludes = ['Comfortable safari jeep', 'Local safari guidance', 'WhatsApp booking support', 'Pickup support on request'];

function getPriceNumber(priceValue) {
  const match = String(priceValue || '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function formatPrice(value, fallback = '$0') {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'string' && /\$|Rs|LKR/i.test(value)) return value;
  const num = typeof value === 'number' ? value : getPriceNumber(value);
  if (!num) return fallback;
  return `$${num}`;
}

function normalizePackage(pkg, index) {
  const fallback = fallbackPackages[index % fallbackPackages.length];
  const currentPriceNumber = getPriceNumber(pkg.price ?? fallback.price);
  const oldPriceNumber = getPriceNumber(pkg.oldPrice);
  const discountNumber = getPriceNumber(pkg.discountPercent);
  const derivedOldPrice = oldPriceNumber || (currentPriceNumber ? Math.ceil(currentPriceNumber * 1.22) : null);
  const derivedDiscount = discountNumber || (currentPriceNumber && derivedOldPrice ? Math.max(10, Math.round(((derivedOldPrice - currentPriceNumber) / derivedOldPrice) * 100)) : 15);

  return {
    ...fallback,
    ...pkg,
    badge: pkg.badge || fallback?.badge || 'Safari Package',
    text: pkg.text || pkg.description || fallback?.text || 'Premium Yala safari package for travelers who want a safe, comfortable and memorable wildlife experience.',
    includes: Array.isArray(pkg.includes) && pkg.includes.length ? pkg.includes : defaultIncludes,
    price: formatPrice(pkg.price || fallback.price, '$0'),
    oldPrice: formatPrice(pkg.oldPrice || derivedOldPrice, '$0'),
    discountPercent: typeof pkg.discountPercent === 'string' && pkg.discountPercent ? pkg.discountPercent : `${derivedDiscount}% OFF`,
  };
}

export default function PackagesSection() {
  const [packages, setPackages] = useState(fallbackPackages);

  useEffect(() => {
    let ignore = false;
    async function loadPackages() {
      try {
        const response = await fetch('/api/packages', { cache: 'no-store' });
        const result = await response.json();
        if (!ignore && result.success && Array.isArray(result.packages)) {
          const published = result.packages
            .filter((pkg) => String(pkg.visibility || '').toLowerCase() === 'published')
            .map(normalizePackage);
          if (published.length) setPackages(published);
        }
      } catch (error) {
        // Keep fallback packages for static preview/build mode.
      }
    }
    loadPackages();
    return () => { ignore = true; };
  }, []);

  function bookPackage(packageTitle) {
    window.dispatchEvent(new CustomEvent('azure-package-selected', { detail: { packageTitle } }));
    const bookingArea = document.getElementById('booking');
    if (bookingArea) bookingArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#booking`);
  }

  return (
    <section id="packages" className="section packages-section figma-page">
      <span className="small-label left-label">Our Safari Packages</span>
      <h2>Choose Your Safari Experience</h2>
      <p className="section-intro left-intro">
        Every safari is different. Choose a package and tap <strong>Book This Safari</strong>. The booking form will auto-select that package so travelers can submit faster.
      </p>
      <div className="package-stack">
        {packages.map((item, index) => (
          <article className={`package-card ${index === 0 ? 'featured' : ''}`} key={item.id || item.title}>
            <div>
              <span className="package-badge">{item.badge}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="package-meta-row">
                <span>{item.duration}</span>
                <span>{item.capacity}</span>
              </div>
              <div className="package-price-wrap">
                <div className="package-price-block">
                  <small>Special offer</small>
                  <div className="package-price-row">
                    <strong>{item.price}</strong>
                    <del>{item.oldPrice}</del>
                    <em>{item.discountPercent}</em>
                  </div>
                </div>
              </div>
            </div>
            <div className="included-block">
              <span>What’s Included</span>
              <ul>
                {item.includes.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
            <button type="button" className="package-link package-book-btn" onClick={() => bookPackage(item.title)}>
              Book This Safari
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
