import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices } from '@/app/lib/data'; // remove fetchRevenue - fetchCardData
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function Page() {
  
  // const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  //   totalCapturedInvoices,
  //   totalAuthorisedInvoices,
  // } = await fetchCardData();
  

  return (
    <main >
      
      <h1 className={` mb-4 text-xl md:text-2xl zip-font`}>
        Sandbox Tools
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
          {/* <CardsSkeleton /> */}
        </Suspense>
        {/* <Card title="Collected" value={totalCapturedInvoices} type="collected" />
        <Card title="Pending" value={totalAuthorisedInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
          {/* <RevenueChartSkeleton /> */}
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
          {/* <LatestInvoicesSkeleton /> */}
        </Suspense>
      </div>
    </main>
  );
}