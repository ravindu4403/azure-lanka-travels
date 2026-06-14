import AdminShell from '@/components/admin/AdminShell';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';
import PricingSettingsForm from '@/components/admin/PricingSettingsForm';
import { getSiteSettings } from '@/lib/siteSettings';
import { getPricingSettings } from '@/lib/pricingSettings';

export const dynamic = 'force-dynamic';
export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const pricingSettings = await getPricingSettings();
  return (
    <AdminShell title="Homepage & Settings" eyebrow="Website CMS">
      <PricingSettingsForm initialPricing={pricingSettings} />
      <SiteSettingsForm initialSettings={settings} />
    </AdminShell>
  );
}
