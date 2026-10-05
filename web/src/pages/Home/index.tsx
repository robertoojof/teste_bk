import { DashboardOverview } from '@/components/DashboardOverview';
import { OrdersSection } from '@/components/OrdersSection';
import { ProductCostsSection } from '@/components/ProductCostsSection';
import { ProductsSection } from '@/components/ProductsSection';
import { MainTemplate } from '@/templates/MainTemplate';

export function Home() {
  return (
    <MainTemplate>
      <DashboardOverview />
      <OrdersSection />
      <ProductsSection />
      <ProductCostsSection />
    </MainTemplate>
  );
}
