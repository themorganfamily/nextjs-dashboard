import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { LatestInvoice } from '@/app/lib/definitions';
import { fetchLatestInvoices, fetchRevenue, fetchLatestCustomers } from '@/app/lib/data';
import InvoiceProduct from '@/app/ui/invoices/product';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';



export default async function LatestInvoices() {
  { // Make component async, remove the props
    const latestCustomers = await fetchLatestCustomers(); // Fetch data inside the component
    return (
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Latest Customers
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
          {/* NOTE: Uncomment this code in Chapter 7 */}

          <div className="bg-white px-6">
            {latestCustomers.map((customer, i) => {
              return (
                <div
                  key={customer.id}
                  className={clsx(
                    'flex flex-row items-center justify-between py-4',
                    {
                      'border-t': i !== 0,
                    },
                  )}
                >
                  <div className="flex items-center">
                    <Image
                      src={customer.image_url}
                      alt={`${customer.name}'s profile picture`}
                      className="mr-4 rounded-full"
                      width={32}
                      height={32}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {customer.name}
                      </p>
                      <p className="hidden text-sm text-gray-500 sm:block">
                        {/* {customer.email} */}
                        {formatDateToLocal(customer.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={` truncate text-sm font-medium md:text-base`}
                  >
                    {/* {customer.account_type} */}
                    <InvoiceProduct product={customer.account_type} />

                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center pb-2 pt-6">
            <ArrowPathIcon className="h-5 w-5 text-gray-500" />
            <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
          </div>
        </div>
      </div>
    );
  }
}