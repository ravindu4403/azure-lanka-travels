import AdminShell from '@/components/admin/AdminShell';
import { AccommodationRequestsPanel } from '@/components/admin/AdminRequestPanels';

export default function AdminAccommodationRequestsPage() {
  return (
    <AdminShell title="Accommodation Requests" eyebrow="Manual hotel assistance workflow">
      <AccommodationRequestsPanel />
    </AdminShell>
  );
}
