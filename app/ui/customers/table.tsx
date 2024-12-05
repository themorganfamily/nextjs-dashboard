import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  Customer,
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { TopUp, Unlock, DeleteCustomer } from '@/app/ui/invoices/buttons';
import InvoiceProduct from '@/app/ui/invoices/product';
import Tokenised from '@/app/ui/invoices/tokenised';
import { fetchFilteredCustomers } from '@/app/lib/data';

export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const customers = await fetchFilteredCustomers(query, currentPage);

  return (

    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {customers?.map((customer) => (
                <div
                  key={customer.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{customer.email}</p>
                        </div>
                      </div>
                      {/* <p className="text-sm text-gray-500">
                        {customer.email}
                      </p> */}
                    </div>
                  </div>

                </div>
              ))}
            </div>
            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Email
                  </th>
                  {/* <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th> */}
                  <th scope="col" className="px-3 py-5 font-medium">
                    Account Type
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Tokenised?
                  </th>
                  {/* <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                    
                  </th> */}
                  <th scope="col" className="px-3 py-5 font-medium flex justify-end" >
                    Top-up / Unlock
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-900">
                {customers.map((customer) => (
                  <tr key={customer.id} className="group">
                    <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      <div className="flex items-center gap-3">
                        <Image
                          src={customer.image_url}
                          className="rounded-full"
                          alt={`${customer.name}'s profile picture`}
                          width={28}
                          height={28}
                        />
                        <p>{customer.email}</p>
                      </div>
                    </td>
                    {/* <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {customer.email}
                    </td> */}
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      <InvoiceProduct product={customer.account_type} />
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      <Tokenised tokenised={customer.tokenised} />
                    </td>
                    <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {/* {(invoice.status !== 'refunded' && invoice.status !== 'cancelled') ?
                          <> */}

                        {/* </>
                          :
                          <>
                            <DeleteInvoice id={invoice.id} />
                          </>} */}
                        <TopUp id={customer.id} />
                        <Unlock id={customer.consumer_id} />
                        {/* <DeleteCustomer id={customer.id} /> */}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
