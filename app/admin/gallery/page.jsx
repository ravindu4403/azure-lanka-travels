import AdminShell from '@/components/admin/AdminShell';
import { GalleryTable } from '@/components/admin/AdminTables';

export default function AdminGalleryPage() {
  return (
    <AdminShell title="Gallery Management" eyebrow="Photos, videos and approval queue">
      <GalleryTable />
    </AdminShell>
  );
}
