'use client';

import { usePathname } from 'next/navigation';

function Icon({ type }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (type === 'home') return <svg {...common}><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5h5v5"/></svg>;
  if (type === 'safari') return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="m14.8 9.2-1.7 4.1-4.1 1.7 1.7-4.1 4.1-1.7Z"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>;
  if (type === 'book') return <svg {...common}><path d="M8 3v3M16 3v3"/><path d="M4 8h16"/><rect x="4" y="5" width="16" height="16" rx="3"/><path d="m9 14 2 2 4-5"/></svg>;
  if (type === 'gallery') return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8" cy="10" r="1.5"/><path d="m21 15-5-5L5 19"/></svg>;
  return <svg {...common}><path d="M4 12h16"/><path d="M5 12V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4"/><path d="M6 12v7M18 12v7M4 19h16"/></svg>;
}

const items = [
  ['Home', '/#home', 'home'],
  ['Safari', '/#packages', 'safari'],
  ['Book', '/#booking', 'book'],
  ['Gallery', '/gallery', 'gallery'],
  ['Stay', '/accommodation-request', 'stay'],
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav smart-mobile-nav" aria-label="Mobile quick navigation">
      {items.map(([label, href, icon]) => {
        const active = (pathname === '/' && href === '/#home') || pathname === href;
        return (
          <a href={href} key={label} className={active ? 'is-active' : ''}>
            <span className="nav-icon"><Icon type={icon} /></span>
            <small>{label}</small>
          </a>
        );
      })}
    </nav>
  );
}
