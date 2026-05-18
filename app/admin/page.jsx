import AdminShell from '@/components/admin/AdminShell';
import { adminStats, bookingRows } from '@/data/adminData';
import { reviewRecords } from '@/data/reviews';
import { CalendarCheck, Star, PackageOpen, TrendingUp } from 'lucide-react';

const icons = [TrendingUp, CalendarCheck, PackageOpen, Star];

export default function AdminDashboardPage() {
  const pendingReviews = reviewRecords.filter((review) => review.status === 'pending');

  return (
    <AdminShell title="Admin Dashboard">
      <section className="admin-stats-grid">
        {adminStats.map((stat, index) => {
          const Icon = icons[index];
          return (
            <article className="admin-stat-card" key={stat.label}>
              <Icon size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.trend}</p>
            </article>
          );
        })}
      </section>

      <section className="admin-overview-grid">
        <article className="admin-panel-card">
          <div className="admin-card-heading">
            <div><span>Today Focus</span><h2>Pending actions</h2></div>
          </div>
          <div className="admin-task-list">
            <p><strong>{bookingRows.filter((row) => row.status === 'Pending').length}</strong> booking requests need accept/reject action.</p>
            <p><strong>{pendingReviews.length}</strong> customer reviews are waiting for approval.</p>
            <p><strong>1</strong> package is still in draft and hidden from customers.</p>
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
