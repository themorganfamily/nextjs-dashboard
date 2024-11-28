import { PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice, oldDeleteInvoice } from '@/app/lib/actions';
import Modal from '@/app/ui/invoices/modal';
import { lusitana } from '@/app/ui/fonts';


import Link from 'next/link';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusCircleIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function CreateCheckout() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusCircleIcon className="h-5 md:mr-2" /><span className="hidden md:block md:mr-1">Create Order</span>{' '}
      {/* <PlusIcon className="h-5 md:ml-4" /> */}
    </Link>
  );
}

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusCircleIcon className="h-5 md:mr-2" /><span className="hidden md:block md:mr-1">Create Customer</span>{' '}
      {/* <PlusIcon className="h-5 md:ml-4" /> */}
    </Link>
  );
}

export function CreateCustomerToolKit() {
  return (
    <p
    className={`${lusitana.className}
      truncate rounded-xl bg-white px-4 py-8 text-center text-2xl mt-1 h-30`}
  >
    
  
    <Link
      href="/dashboard/customers/create"
      className="flex items-center  px-4 text-2xl rounded-xl font-medium  transition-colors hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusCircleIcon className="h-6 md:mr-2" /><span className="hidden md:block md:mr-1">Create Customer</span>{' '}
      {/* <PlusIcon className="h-5 md:ml-4" /> */}
    </Link></p>
  );
}

export function GetMFA() {
  return (
    <Link
      href="/dashboard/MFA"
      className="flex h-8 pb-1 items-center text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block pl-2 pt-1">Fetch Code</span>{' '}
      {/* <PlusIcon className="h-5 md:ml-4" /> */}
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = oldDeleteInvoice.bind(null, id);

  return (
    <div>
      {/* <Modal /> */}
      <form action={deleteInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </div>
  );
}

export function TopUp({ id }: { id: string }) {
  const deleteInvoiceWithId = oldDeleteInvoice.bind(null, id);

  return (
    <div>
      {/* <Modal /> */}
      <form action={deleteInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </div>
  );
}

export function Unlock({ id }: { id: string }) {
  const deleteInvoiceWithId = oldDeleteInvoice.bind(null, id);

  return (
    <div>
      {/* <Modal /> */}
      <form action={deleteInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </div>
  );
}
