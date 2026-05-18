import AdminShell from '@/components/admin/AdminShell';
import { BookingsTable } from '@/components/admin/AdminTables';

export default function AdminBookingsPage() {
  return (
    <AdminShell title="Booking Management" eyebrow="Requests, status and manual bookings">
      <BookingsTable />
    </AdminShell>
  );
}
