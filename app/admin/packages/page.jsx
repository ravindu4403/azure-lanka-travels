import AdminShell from '@/components/admin/AdminShell';
import { PackagesTable } from '@/components/admin/AdminTables';

export default function AdminPackagesPage() {
  return (
    <AdminShell title="Safari Package CMS" eyebrow="Prices, capacity and package content">
      <PackagesTable />
    </AdminShell>
  );
}
