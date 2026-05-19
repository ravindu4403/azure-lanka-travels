import AdminShell from '@/components/admin/AdminShell';
import { BlogCmsPanel } from '@/components/admin/AdminTables';

export const dynamic = 'force-dynamic';
export default function AdminBlogPage() {
  return (
    <AdminShell title="Blog CMS" eyebrow="SEO content growth system">
      <BlogCmsPanel />
    </AdminShell>
  );
}
