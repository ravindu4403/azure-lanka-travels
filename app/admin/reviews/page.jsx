import AdminShell from '@/components/admin/AdminShell';
import AdminReviewsPanel from '@/components/admin/AdminReviewsPanel';

export const dynamic = 'force-dynamic';
export default function AdminReviewsPage() {
  return (
    <AdminShell title="Review Management" eyebrow="Approve traveler reviews before publishing">
      <AdminReviewsPanel />
    </AdminShell>
  );
}
