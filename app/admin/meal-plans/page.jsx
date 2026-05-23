import { MealPlansPanel } from '@/components/admin/AdminTables';

export const metadata = { title: 'Meal Plans | Azure Lanka Admin', robots: { index: false, follow: false } };

export default function AdminMealPlansPage() {
  return <MealPlansPanel />;
}
