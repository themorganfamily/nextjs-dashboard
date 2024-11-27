'use client';

import { CreditProduct, CustomerField, InvoiceForm } from '@/app/lib/definitions';
import { updateInvoice, deleteInvoice, State, oldDeleteInvoice } from '@/app/lib/actions';
import { useActionState } from 'react';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  XMarkIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button} from '@/app/ui/button';
import { SpinnerButton } from "../SpinnerButton"

import { useState, useEffect } from "react"
import { redirect } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';

export default function EditInvoiceForm({
  invoice,
  customers
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialState: State = { message: null, errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  // const deleteInvloiceWithId = deleteInvoice.bind(null, invoice.id);


  const clientSubmit = async () => {

    // console.log(amount);
    // if (amount !== undefined) {
    //       state.message = null;
    //       state.errors = {};
    // }
    setIsLoading(true);
  }

  const serverSubmit = async (prevState: State, formData: FormData) => {
    // disableLoading();
    setIsLoading(false);
    let returnState: any;
    if(invoice.status ==="authorised") {
      returnState = await updateInvoiceWithId(prevState, formData);
      return returnState;
    }
    else if(formData.get("status") ==="deleted") {
      await oldDeleteInvoice(invoice.id);
    }
    else {
      
      returnState = await deleteInvoice(invoice.id, prevState, formData);
      return returnState;
     // window.location.replace('/dashboard/invoices');
    }
    

  }

  const [state, formAction] = useActionState(serverSubmit, initialState);

  // const [state, formAction] = useActionState(serverSubmit, initialState);
  
  // const [state, formAction] = useActionState(updateInvoiceWithId, initialState);
  return (
    <form action={formAction} aria-describedby="form-error">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4" hidden>
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.customer_id}
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input 
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={invoice.captured_amount}
                placeholder="Enter AUD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Select an order action
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div>
                {invoice.status === 'authorised' &&
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        id="cancelled"
                        name="status"
                        type="radio"
                        value="cancelled"
                        defaultChecked={false}
                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        aria-describedby="status-error"
                      />
                      <label
                        htmlFor="cancelled"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-red-100"
                      >
                        Cancel <XMarkIcon className="h-4 w-4" />
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="captured"
                        name="status"
                        type="radio"
                        value="captured"
                        defaultChecked={true}
                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                      />
                      <label
                        htmlFor="captured"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-green-200"
                      >
                        Capture <CheckIcon className="h-4 w-4" />
                      </label>

                    </div>
                  </div>}
                  {invoice.status === 'partially refunded'  &&
                  <div>
                    <div className="flex items-center">
                      <input
                        id="refunded"
                        name="status"
                        type="radio"
                        value="refunded"
                        defaultChecked={true}
                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        aria-describedby="status-error"
                      />
                      <label
                        htmlFor="refunded"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-red-100"
                      >
                        Refund <ReceiptRefundIcon className="h-4 w-4" />
                      </label>
                    </div>   
                    </div>   
                }
                {invoice.status === 'refunded'  &&
                  <div>
                    <div className="flex items-center">
                      <input
                        id="deleted"
                        name="status"
                        type="radio"
                        value="deleted"
                        defaultChecked={true}
                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        aria-describedby="status-error"
                      />
                      <label
                        htmlFor="deleted"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-red-100"
                      >
                        Delete <XMarkIcon className="h-4 w-4" />
                      </label>
                    </div>   
                    </div>   
                }
                {invoice.status === 'captured'  &&
                  <div>
                    <div className="flex items-center">
                      <input
                        id="refunded"
                        name="status"
                        type="radio"
                        value="refunded"
                        defaultChecked={true}
                        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        aria-describedby="status-error"
                      />
                      <label
                        htmlFor="refunded"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-red-100"
                      >
                        Refund <XMarkIcon className="h-4 w-4" />
                      </label>
                    </div>   
                    </div>   
                }
                  </div>



           
                  

              </div>

            </div>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>

            <div id="form-error" aria-live="polite" aria-atomic="true">
              <p className="mt-2 text-sm text-red-500">
                {state.message}
              </p>
            </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        {/* <Button type="submit">Edit Invoice</Button> */}
        <SpinnerButton name="Edit Invoice" state={isLoading} onClick={clientSubmit} type="submit" children="" />

      </div>
    </form>
  );
}
