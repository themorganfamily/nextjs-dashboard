'use client'
import { PencilIcon, PlusCircleIcon, TrashIcon, LockOpenIcon, BanknotesIcon, MapIcon } from '@heroicons/react/24/outline';
import { deleteInvoice, oldDeleteInvoice, deleteCustomer, topUpBalance, selectPaymentFlow, State, createUser} from '@/app/lib/actions';
import Modal from '@/app/ui/invoices/modal';
import { lusitana } from '@/app/ui/fonts';
import { useActionState, useState } from "react"
import { Oval } from "react-loader-spinner"

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

export function TopUp({ id }: { id: string}) {
  var initialState: State = { message: null, errors: {}, isLoading: false};
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const clientSubmit = async () => {
    setIsLoading(true);
  }

  const serverSubmit = async (prevState: State, formData: FormData) => {
    // disableLoading();
    setIsLoading(false);
    const returnState: State = await topUpBalance(id, 100000);
    return returnState;

  }

  const [state, formAction] = useActionState(serverSubmit, initialState);

  // const topUpWithConsumerId = topUpBalance.bind(null, id, 100000);
  return (
    <div>
      {/* <Modal /> */}
      <form action={formAction}>
        <button className="rounded-md border p-2 hover:bg-gray-100" onClick={clientSubmit}>
        {/* <button className="rounded-md border p-2 hover:bg-gray-100 w-20 text-sm flex h-10 items-center"> */}
          <span className="sr-only">Top Up</span>
          {isLoading ? 
           <Oval
           visible={true}
           height="20"
           width="20"
           color="#000000"
           secondaryColor="#000000"
           ariaLabel="oval-loading"
           wrapperStyle={{minWidth:"20"}} // minWidth:"90"
           wrapperClass=""
           strokeWidth="6"
       />
          :
          <BanknotesIcon className="w-5" />
}
        </button>
      </form>
    </div>
  );
}

export function PaymentFlowButton({ paymentFlows }: { paymentFlows:any }) {
  const selectPaymentFlowId = selectPaymentFlow.bind(null, paymentFlows);
  console.log("in payment flow select");
  return (
    <>
      <form action={selectPaymentFlowId}>
      <input type="submit" formAction={selectPaymentFlowId}>
        <div className="mb-4" >
          <label htmlFor="paymentFlow" className="mb-2 block text-sm font-medium">
            Choose a payment flow
          </label>
          <div className="relative">
            <select
              id="paymentFlow"
              name="paymentFlow"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="paymentFlow-error"
            // onChange={choosePaymentFlow}
            >
              <option value="" disabled>
                Select a payment flow
              </option>
              {paymentFlows.map((paymentFlow: any) => (
                <option key={paymentFlow.id} value={paymentFlow.id}>
                  {paymentFlow.name}
                </option>
              ))}

            </select>
            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        </input>
      </form>


     
    </>
  );
}

export function Unlock({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id);

  return (
    <div>
      {/* <Modal /> */}
      <form action={deleteCustomerWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <LockOpenIcon className="w-5" />
        </button>
      </form>
    </div>
  );
}

export function DeleteCustomer({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id);

  return (
    <div>
      {/* <Modal /> */}
      <form action={deleteCustomerWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </div>
  );
}
