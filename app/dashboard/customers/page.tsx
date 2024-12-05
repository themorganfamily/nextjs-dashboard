import { Metadata } from 'next';

  import Pagination from '@/app/ui/invoices/pagination';
  import { fetchInvoicesPages } from '@/app/lib/data';
  import Search from '@/app/ui/search';
  import Table from '@/app/ui/customers/table';
  import { CreateInvoice, CreateCheckout, CreateCustomer } from '@/app/ui/invoices/buttons';
  import { lusitana } from '@/app/ui/fonts';
  import { InvoicesTableSkeleton, loadingSkelelton} from '@/app/ui/skeletons';
  import { Suspense } from 'react';
import { customers } from '@/app/lib/placeholder-data';
import { fetchCustomers } from '@/app/lib/data';
import {
  Customer,
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';

   
  export const metadata: Metadata = {
    title: 'Customers',
  };
   
  export default async function Page(props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query);

    const customers:any[] = await fetchCustomers();

    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search customers..." />
          <CreateCustomer />
        </div>
         <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table query={query} currentPage={currentPage}  />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }
  