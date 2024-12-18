import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import InvoiceProduct from '@/app/ui/invoices/product';
import InvoiceIFM from '@/app/ui/invoices/terms';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {invoices?.map((invoice) => (
                <div
                  key={invoice.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                      <div className="mb-2 flex items-center">
                        <Image
                          src={invoice.image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={`${invoice.name}'s profile picture`}
                        />
                        <p>{invoice.name}</p>
                      </div>
                      {/* <p className="text-sm text-gray-500">{invoice.email}</p> */}
                    {/* <InvoiceProduct product={invoice.product} /> */}
                    <InvoiceStatus status={invoice.status} />
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <p>{formatDateToLocal(invoice.date)}</p>
                    </div>
                    {/* <p className="text-sm text-gray-500">{invoice.reference}</p>
                  <p className="text-sm text-gray-500">{invoice.receipt_number}</p> */}

                    {/* <InvoiceIFM product={invoice.product} interestFreeMonths={invoice.interest_free_months}/> */}
                    <div className="flex justify-end gap-2">
                      <UpdateInvoice id={invoice.id} />
                      {/* <DeleteInvoice id={invoice.id} /> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Customer
                  </th>
                  {/* <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th> */}
                  <th scope="col" className="px-3 py-5 font-medium">
                    Amount
                  </th>

                  <th scope="col" className="px-3 py-5 font-medium">
                    Status
                  </th>
                  {/* <th scope="col" className="px-3 py-5 font-medium">
                    Reference
                  </th> */}
                  <th scope="col" className="px-3 py-5 font-medium">
                    Receipt
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Interest Free Months
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white">
                {invoices?.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="w-full border-b py-3 text-sm [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap px-3 py-3 ">
                      <span className="rounded-full px-2 py-1 text-xs bg-gray-100"> {formatDateToLocal(invoice.date)} </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">

                      <div className="flex items-center gap-3 " style={{overflow: 'hidden'}}>
                        {/* <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      /> */}
                        <p>{invoice.email}</p>
                      </div>
                    </td>
                    {/* <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td> */}
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(invoice.amount)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <InvoiceStatus status={invoice.status} />
                    </td>
                    {/* <td className="whitespace-nowrap px-3 py-3">
                      {invoice.reference}
                    </td> */}
                    <td className="whitespace-nowrap px-3 py-3">
                      {invoice.receipt_number}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <InvoiceProduct product={invoice.product} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <InvoiceIFM product={invoice.product} interestFreeMonths={invoice.interest_free_months} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {(invoice.status !== 'refunded' && invoice.status !== 'cancelled') ?
                          <>
                            <UpdateInvoice id={invoice.id} />
                            {/* <DeleteInvoice id={invoice.id} /> */}
                          </>
                          :
                          <>
                            {/* <DeleteInvoice id={invoice.id} /> */}
                          </>}

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
