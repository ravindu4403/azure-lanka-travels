export default function Footer({ settings }) {
  return (
    <footer className="footer figma-page footer-luxe">
      <div className="footer-brand">
        <span>© 2026 {settings?.siteName || 'Azure Lanka Travels'}. All rights reserved.</span>
        <small>Premium Yala safari experiences for travelers from around the world.</small>
      </div>
      <nav className="footer-links" aria-label="Footer links">
        <a href="/accommodation-request">Accommodation Request</a>
        <a href="/blog">Safari Blog</a>
        <a href="/gallery">Gallery</a>
      </nav>
      <div className="spellzz-credit">
        <span>{settings?.footerCredit || 'Crafted by SPELLZZ'}</span>
        <img src="/logos/spellzz-color.png" alt="SPELLZZ" />
      </div>
    </footer>
  );
}
