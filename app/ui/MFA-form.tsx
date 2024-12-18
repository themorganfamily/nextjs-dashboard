"use client"

import { useState, useEffect } from "react"
import { SpinnerButton } from "./SpinnerButton"
import { CreditProduct, CustomerField, PaymentFlow } from '@/app/lib/definitions';
import { useActionState } from 'react';
import { State, getVerificationCode } from '@/app/lib/actions';
import { DevicePhoneMobileIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { getParsedType } from "zod";
import Modal from "./invoices/modal";



export default function Form({ customers, amount, creditProducts, paymentFlows }: { customers: CustomerField[], amount: number | undefined, creditProducts: CreditProduct[], paymentFlows: PaymentFlow[]}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  var initialState: State = { message: null, errors: {}, isLoading: false };
  var clientSideValidation = false;
  var verificationCode = "";

 

  // useEffect(() => {
  //   var amountInput = document.querySelector("amount");
  //   amountInput?.addEventListener("keyup", () => {
  //     console.log("why");
  //   })
  // }, []);

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
    const returnState: State = await getVerificationCode(prevState, formData);
    // if (verificationResponse.error !== undefined) {
    //     console.log(verificationResponse.error);
    //     verificationCode = verificationResponse.error;
    //     return verificationResponse.error;
    // }
    // else if (verificationResponse.otp !== undefined) {
    //     console.log(verificationResponse.otp);
    //     verificationCode = verificationResponse.otp;
    //     return verificationResponse.otp;
    // }
    return returnState;

  }

  const [state, formAction] = useActionState(serverSubmit, initialState);

  if (state.message !== null) {
    amount = undefined;
  }

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
              defaultValue=""
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
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
              {/* Payment flow */}
        <div className="mb-4" hidden>
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose a payment flow
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
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
        </div>
        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an AU mobile number
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="any"
                placeholder="Enter customer mobile"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
                defaultValue={amount}
              />
              <DevicePhoneMobileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
          <div className="mb-4" hidden>
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

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Choose the relevant flow being tested
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
                  Payment flow <CurrencyDollarIcon className="h-4 w-4" />
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
                  Sign up flow <UserPlusIcon className="h-4 w-4" />
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
          {state.otp && 
          <>
          <p className="pt-3">Your verification code:  {state.otp}</p>
          {/* <Modal code="test" /> */}
          </> }
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <SpinnerButton name="Get code" state={isLoading} onClick={clientSubmit} type="submit" children="" />

      </div>


    </form>
  )
}






