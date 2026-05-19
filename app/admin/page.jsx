import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { readCollection } from '@/lib/jsonDb';
import { CalendarCheck, Star, PackageOpen, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

function isUpcomingBooking(booking) {
  if (!booking?.date) return false;
  const status = String(booking.status || '').toLowerCase();
  if (['rejected', 'cancelled', 'completed'].includes(status)) return false;
  const bookingDate = new Date(`${booking.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(bookingDate.getTime()) && bookingDate >= today;
}

async function safeCollection(name) {
  try {
    return await readCollection(name);
  } catch (error) {
    console.error(`Admin dashboard failed to read ${name}`, error);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const [bookings, contactRequests, accommodationRequests, packages, reviews] = await Promise.all([
    safeCollection('bookings'),
    safeCollection('contactRequests'),
    safeCollection('accommodationRequests'),
    safeCollection('packages'),
    safeCollection('reviews'),
  ]);

  const pendingBookings = bookings.filter((item) => String(item.status || '').toLowerCase() === 'pending');
  const newInquiries = contactRequests.filter((item) => ['new', 'open', 'pending'].includes(String(item.status || '').toLowerCase()));
  const newAccommodation = accommodationRequests.filter((item) => ['new', 'searching hotels'].includes(String(item.status || '').toLowerCase()));
  const pendingReviews = reviews.filter((item) => String(item.status || '').toLowerCase() === 'pending');
  const draftPackages = packages.filter((item) => String(item.visibility || '').toLowerCase() !== 'published');
  const upcomingSafaris = bookings.filter(isUpcomingBooking);
  const approvedReviews = reviews.filter((item) => String(item.status || '').toLowerCase() === 'approved');

  const stats = [
    { label: 'Total Bookings', value: bookings.length, trend: pendingBookings.length ? `${pendingBookings.length} pending` : 'No pending bookings', href: '/admin/bookings', icon: TrendingUp },
    { label: 'Pending Requests', value: pendingBookings.length + newInquiries.length + newAccommodation.length + pendingReviews.length, trend: 'Needs review', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Upcoming Safaris', value: upcomingSafaris.length, trend: 'From live booking dates', href: '/admin/bookings', icon: PackageOpen },
    { label: 'Approved Reviews', value: approvedReviews.length, trend: `${pendingReviews.length} waiting`, href: '/admin/reviews', icon: Star },
  ];

  return (
    <AdminShell title="Admin Dashboard">
      <section className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link className="admin-stat-card clickable" href={stat.href} key={stat.label}>
              <Icon size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.trend}</p>
            </Link>
          );
        })}
      </section>

      <section className="admin-overview-grid">
        <article className="admin-panel-card">
          <div className="admin-card-heading">
            <div><span>Today Focus</span><h2>Pending actions</h2></div>
          </div>
          <div className="admin-task-list">
            <Link href="/admin/bookings"><strong>{pendingBookings.length}</strong> booking requests need accept/reject action.</Link>
            <Link href="/admin/contact-requests"><strong>{newInquiries.length}</strong> customer inquiries are waiting for reply.</Link>
            <Link href="/admin/accommodation"><strong>{newAccommodation.length}</strong> accommodation requests need follow-up.</Link>
            <Link href="/admin/reviews"><strong>{pendingReviews.length}</strong> customer reviews are waiting for approval.</Link>
            <Link href="/admin/packages"><strong>{draftPackages.length}</strong> packages are still in draft and hidden from customers.</Link>
          </div>
        </article>

        <article className="admin-panel-card admin-seo-card">
          <span>SEO Control</span>
          <h2>Keep tourism pages fresh</h2>
          <p>Update package descriptions, FAQs, gallery alt text and blog posts regularly to rank for Yala safari booking keywords.</p>
          <ul>
            <li>Review homepage headings monthly</li>
            <li>Add new safari blog posts</li>
            <li>Publish real traveler reviews only after approval</li>
          </ul>
        </article>
      </section>
    </AdminShell>
  );
}
