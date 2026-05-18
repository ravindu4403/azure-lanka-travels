import AdminShell from '@/components/admin/AdminShell';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';
import { getSiteSettings } from '@/lib/siteSettings';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <AdminShell title="Homepage & Settings" eyebrow="Website CMS">
      <SiteSettingsForm initialSettings={settings} />
    </AdminShell>
  );
}
