import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, CalendarCheck, GalleryHorizontalEnd, Star, PackageOpen, Globe2, Settings, Newspaper, Mail, Hotel, Utensils } from 'lucide-react';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/accommodation', label: 'Accommodation', icon: Hotel },
  { href: '/admin/contact-requests', label: 'Inquiries', icon: Mail },
  { href: '/admin/packages', label: 'Packages', icon: PackageOpen },
  { href: '/admin/meal-plans', label: 'Meal Plans', icon: Utensils },
  { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontalEnd },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({ children, title = 'Admin Panel', eyebrow = 'Azure Lanka Control Center' }) {
  return (
    <div className="admin-app-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand" aria-label="Back to website">
          <Image src="/logos/azure-logo-transparent.png" alt="Azure Lanka Travels logo" width={74} height={74} />
          <span>
            <strong>Azure Lanka</strong>
            <small>Tourism CMS</small>
          </span>
        </Link>

        <nav className="admin-nav" aria-label="Admin navigation">
          {links.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={href}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-card">
          <Globe2 size={20} />
          <strong>SEO-first website</strong>
          <p>Manage content, bookings and approvals without touching code.</p>
        </div>
      </aside>

      <div className="admin-main-area">
        <header className="admin-topbar">
          <div>
            <span>{eyebrow}</span>
            <h1>{title}</h1>
          </div>
          <div className="admin-actions">
            <Link href="/" className="admin-ghost-btn">View Website</Link>
            <AdminLogoutButton />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
