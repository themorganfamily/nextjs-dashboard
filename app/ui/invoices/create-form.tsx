"use client"

import { useState, useEffect } from "react"
import { SpinnerButton } from "../SpinnerButton"
import { CreditProduct, CustomerField, PaymentFlow } from '@/app/lib/definitions';
import { useActionState } from 'react';
import { State, redirectToZip } from '@/app/lib/actions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  SwatchIcon,
  MapIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { getParsedType } from "zod";



export default function Form({
  customers,
  amount,
  creditProducts,
  paymentFlows }: { customers: CustomerField[], amount: number | undefined, creditProducts: CreditProduct[], paymentFlows: PaymentFlow[] }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenFlow, showCustomers] = useState<boolean>(false);
  const [termFlow, showTerms] = useState<boolean>(false);
  const [flowNotNull, showForm] = useState<boolean>(false);

  var initialState: State = { message: null, errors: {}, isLoading: false };
  var clientSideValidation = false;

  // useEffect(() => {
  //   var amountInput = document.querySelector("amount");
  //   amountInput?.addEventListener("keyup", () => {
  //     console.log("why");
  //   })
  // }, []);


    // showForm(false);
  

  function choosePaymentFlow(num: string) {
    //console.log(id);
    //const selectOption = event?.target;
    // console.log(selectOption.);

    if (num !== null && num !== undefined && num !== "") {
      showForm(true)
    }
    

    if (num === '2') {
      showCustomers(true);
    }
    else {
      showCustomers(false);
    }

    if (num === '3') {
      showTerms(true);
    }
    else {
      showTerms(false);
    }

  }
  var choosePaymentFlowBind;


  // var test = document.getElementById("paymentFlow");
  // test?.addEventListener("change", (e) => {
  //   console.log('test'); // logs `false`
  // });

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
    const returnState: State = await redirectToZip(prevState, formData);
    return returnState;

  }

  const [state, formAction] = useActionState(serverSubmit, initialState);

  if (state.message !== null) {
    amount = undefined;
  }
  
  // if (amount !== undefined){
  //   showForm(true)
  // }



  return (
    <form action={formAction} aria-describedby="form-error">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Payment flow */}
       
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
                <option key={paymentFlow.id} value={paymentFlow.id} onClick={(flow) => choosePaymentFlow(paymentFlow.id)}>
                  {paymentFlow.name}
                </option>
              ))}

            </select>
            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
     
     {/* FORM HIDDEN UNTIL FLOW SELECTED */}
        {/* Invoice Amount */}
        {flowNotNull ? 
        <>
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
                placeholder="Enter AUD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
                defaultValue={amount}
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
        

        {/* Credit product Name */}
        
        {termFlow ? 
          <div className="mb-4">
            <label htmlFor="creditProduct" className="mb-2 mt-4 block text-sm font-medium">
              Choose credit product
            </label>
            <div className="relative">
              <select
                id="creditProduct"
                name="creditProductId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="creditProduct-error"
              >
                <option value="" disabled>
                  Select a credit product
                </option>
                {creditProducts.map((creditProduct) => (
                  <option key={creditProduct.id} value={creditProduct.id}>
                    {creditProduct.name}
                  </option>
                ))}
              </select>
              <SwatchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="creditProduct-error" aria-live="polite" aria-atomic="true">
              {state.errors?.creditProductId &&
                state.errors.creditProductId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          : null
        }

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the order handling
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="authorised"
                  name="status"
                  type="radio"
                  value="authorised"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="authorised"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-gray-100"
                >
                  Authorise only <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="captured"
                  name="status"
                  type="radio"
                  value="captured"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                  defaultChecked
                />
                <label
                  htmlFor="captured"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-green-200"
                >
                  Capture <CheckIcon className="h-4 w-4" />
                </label>
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
        <div>
          {/* tokeniseation checkbox */}
          {tokenFlow ? null :
            <><label htmlFor="tokenise" className="mb-2 block text-sm font-medium mt-2">Tokenise customer account?</label>
              <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="tokenise" name="tokenise" className="appearance-none w-4 h-4 rounded-sm bg-white" />
                    <label
                  htmlFor="tokenise"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full pl-1 pr-3 py-1.5 text-xs font-medium bg-white"
                >
                  Save account details 
                </label>
                  </div>
                </div>
              </div>
            </>
          }

          {/* Customer Name */}
          {tokenFlow ?
            <div className="mb-1 mt-2">
              <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                Choose customer
              </label>
              <div className="relative">
                <select
                  id="customer"
                  name="customer"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue=""
                  aria-describedby="customer-error"
                >
                  <option value="" disabled>
                    Select a customer
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.email} ({customer.account_type})
                    </option>
                  ))}
                </select>
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="customer-error" aria-live="polite" aria-atomic="true">
                {state.errors?.customerId &&
                  state.errors.customerId.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div> : null
          }

        </div>
        </>
        : null}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <SpinnerButton name="Create order" state={isLoading} onClick={clientSubmit} type="submit" children="" />

      </div>


    </form>
  )
}






