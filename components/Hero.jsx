import { getWhatsappUrl } from '@/lib/siteSettings';

function getHeroLines(value) {
  const title = String(value || 'Discover The Wild Heart of Sri Lanka').trim();
  const normalized = title.replace(/\s+/g, ' ');

  if (title.includes('\n')) {
    return title.split('\n').map((line) => line.trim()).filter(Boolean);
  }

  if (/discover the wild heart of sri lanka/i.test(normalized)) {
    return ['Discover The', 'Wild Heart of Sri', 'Lanka'];
  }

  return [normalized];
}


function getMobileHeroLines(value) {
  const title = String(value || 'Discover The Wild Heart of Sri Lanka').replace(/\s+/g, ' ').trim();
  if (/discover the wild heart of sri lanka/i.test(title)) {
    return ['Discover The', 'Wild Heart', 'of Sri Lanka'];
  }
  return getHeroLines(value);
}

export default function Hero({ settings }) {
  const lines = getHeroLines(settings?.heroTitle);
  const mobileLines = getMobileHeroLines(settings?.heroTitle);
  const whatsappUrl = getWhatsappUrl(settings, 'Hello Azure Lanka Travels, I want to book a Yala safari');

  return (
    <section id="home" className="hero figma-page">
      <div className="hero-stage">
        <div className="hero-title-wrap">
          <h1 className="hero-title-desktop">
            {lines.map((line) => <span key={line}>{line}</span>)}
          </h1>
          <h1 className="hero-title-mobile">
            {mobileLines.map((line) => <span key={line}>{line}</span>)}
          </h1>
        </div>

        <div className="hero-figure-wrap" aria-label="Yala wildlife composition">
          <img className="hero-figure-img" src="/images/hero/yala-hero-group.png" alt="Yala wildlife collage with elephant, leopard, sloth bear, hare and birds" />
        </div>

        <p className="hero-copy">{settings?.heroSubtitle || 'Experience unforgettable Yala safaris with expert local guides, comfortable jeeps, and breathtaking wildlife encounters.'}</p>

        <div className="hero-actions">
          <a className="btn primary" href="#booking">{settings?.primaryCtaLabel || 'Book Your Safari'}</a>
          <a className="btn gold" href={whatsappUrl} target="_blank">{settings?.whatsappCtaLabel || 'Chat On WhatsApp'}</a>
        </div>
      </div>
    </section>
  );
}
