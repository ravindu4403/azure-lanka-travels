import AdminShell from '@/components/admin/AdminShell';
import { ContactRequestsPanel } from '@/components/admin/AdminRequestPanels';

export const dynamic = 'force-dynamic';
export default function AdminContactRequestsPage() {
  return (
    <AdminShell title="Contact Requests" eyebrow="Tourist inquiries and lead follow-up">
      <ContactRequestsPanel />
    </AdminShell>
  );
}
