import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { ADMIN_COOKIE_NAME, isAdminSessionValid } from '@/lib/adminAuth';

export const metadata = {
  title: 'Admin Login | Azure Lanka Travels',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const session = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (isAdminSessionValid(session)) redirect('/admin');

  return (
    <main className="admin-login-page admin-login-page-premium">
      <div className="admin-login-orb orb-one" />
      <div className="admin-login-orb orb-two" />
      <section className="admin-login-shell admin-login-shell-premium">
        <div className="admin-login-brand-panel admin-login-brand-premium">
          <div className="admin-brand-topline">
            <Image src="/logos/azure-logo-transparent.png" alt="Azure Lanka Travels logo" width={118} height={118} priority />
            <div>
              <span>Azure Lanka Travels</span>
              <strong>Safari Control Center</strong>
            </div>
          </div>

          <div className="admin-brand-copy">
            <small>Tourism CMS • Secure dashboard</small>
            <h2>Manage every safari booking with confidence.</h2>
            <p>
              Keep bookings, packages, gallery moments, blogs and reviews ready for foreign travelers from one clean admin experience.
            </p>
          </div>

          <div className="admin-login-metric-grid">
            <div><strong>24/7</strong><span>Inquiry control</span></div>
            <div><strong>SEO</strong><span>Travel blog tools</span></div>
            <div><strong>CMS</strong><span>Easy content edits</span></div>
          </div>

          <div className="admin-login-pills admin-login-pills-premium">
            <strong>Bookings</strong>
            <strong>Gallery</strong>
            <strong>Packages</strong>
            <strong>Reviews</strong>
          </div>
        </div>
        <AdminLoginForm />
      </section>
    </main>
  );
}
