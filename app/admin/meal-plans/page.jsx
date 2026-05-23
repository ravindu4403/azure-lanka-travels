import AdminShell from '@/components/admin/AdminShell';
import { MealPlansPanel } from '@/components/admin/AdminTables';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Meal Plans | Azure Lanka Admin', robots: { index: false, follow: false } };

export default function AdminMealPlansPage() {
  return (
    <AdminShell title="Meal Plan CMS" eyebrow="Safari meal add-ons and photo uploads">
      <MealPlansPanel />
    </AdminShell>
  );
}
