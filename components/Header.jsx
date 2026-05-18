'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  ['Home', '/#home'],
  ['About', '/#about'],
  ['Packages', '/#packages'],
  ['Gallery', '/#gallery'],
  ['Contact Us', '/#contact'],
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 90) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${hidden ? 'site-header-hidden' : ''}`}>
      <nav className="figma-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => {
          const active = pathname === '/' ? label === 'Home' : false;
          return <a key={label} href={href} className={active ? 'active' : ''}>{label}</a>;
        })}
      </nav>
    </header>
  );
}
