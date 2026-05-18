import AdminShell from '@/components/admin/AdminShell';
import AdminReviewsPanel from '@/components/admin/AdminReviewsPanel';

export default function AdminReviewsPage() {
  return (
    <AdminShell title="Review Management" eyebrow="Approve traveler reviews before publishing">
      <AdminReviewsPanel />
    </AdminShell>
  );
}
