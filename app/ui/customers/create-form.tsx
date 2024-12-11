"use client"

import { useState, useEffect } from "react"
import { SpinnerButton } from "../SpinnerButton"
import { CustomerField } from '@/app/lib/definitions';
import { useActionState } from 'react';
import { State, redirectToZip, createUser, closeModal } from '@/app/lib/actions';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  UsersIcon,
  AtSymbolIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { boolean, getParsedType } from "zod";
import BasicModal from "@/app/ui/basicModal";
import Modal from '@/app/ui/invoices/modal';







export default function Form({ customers }: { customers: CustomerField[] }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalVisible, showModal] = useState<boolean>(false);
  const [sitTight, showSitTight] = useState<boolean>(true);

  var initialState: State = { message: null, errors: {}, isLoading: false, modalVisible: false, title: " We're almost there!", modalMessage: 'This can take a sec, but rest assured your new Zip account is on the way!' };
  // useEffect(() => {
  //   var amountInput = document.querySelector("amount");
  //   amountInput?.addEventListener("keyup", () => {
  //     console.log("why");
  //   })
  // }, []);

  var modalProps = {};

  const showHide = async (val: boolean) => {
    showModal(val);
  }

  // if (email !== undefined && result !== undefined){
  //   showModal(true);
  // }

  const toggleSitTight = async () => {

    type Timer = ReturnType<typeof setTimeout>

    const timer: Timer = setTimeout(() => {
      // showModal(true);

      showSitTight(!sitTight);
      console.log(!sitTight);

    }, 1000)

  }

  const clientSubmit = async () => {

    // console.log(amount);
    // if (amount !== undefined) {
    //       state.message = null;
    //       state.errors = {};
    // }

    setIsLoading(true);

    type Timer = ReturnType<typeof setTimeout>

    const timer: Timer = setTimeout(() => {
      // showModal(true);

      showModal(true);

      const timer: Timer = setTimeout(() => {
        // showModal(true);

        // showModal(false);
        // toggleSitTight();

      }, 6000)

    }, 11000)
  }




  const serverSubmit = async (prevState: State, formData: FormData) => {
    // disableLoading();
    setIsLoading(false);
    const returnState: State = await createUser(prevState, formData);

    console.log(returnState);
    var newEmail = ""
    // if(returnState.email !== undefined && returnState.email !== null) {
    //   newEmail = returnState.email;
    //   returnState.email = undefined;
    // }
    showModal(false);


    type Timer = ReturnType<typeof setTimeout>
    const timer: Timer = setTimeout(() => {
      showSitTight(false);
      showModal(true);
    }, 200)


    // router.push('/about')
    return returnState;

  }

  const [state, formAction] = useActionState(serverSubmit, initialState);


  //   if (state.message !== null) {
  //     amount = undefined;
  //   }
  const copyEmail = async (email: string) => {
    navigator.clipboard.writeText(email);
  }

  return (
    <form action={formAction} aria-describedby="form-error" >
      {/* 
      {modalVisible ?
        <> */}

      <Dialog id="confimrationModal" open={modalVisible} onClose={() => { showModal(false); toggleSitTight(); }} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {sitTight ?
                    <>
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full zip-lightest-bg sm:mx-0 sm:size-10">
                        <ClockIcon aria-hidden="true" className="size-6 zip-dark-text" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">



                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                          We're almost there!
                        </DialogTitle>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            This can take a sec, but rest assured your new Zip account is on the way!
                          </p>

                        </div>
                      </div>
                    </>
                    :
                    <>
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full zip-lightest-bg sm:mx-0 sm:size-10">
                        <CheckIcon aria-hidden="true" className="size-6 zip-dark-text" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                          {state.title}
                        </DialogTitle>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 pb-2 pt-1 inline-flex justify-center">
                            <button className='zip-medium-text flex items-center gap-1 justify-center ' onClick={() => copyEmail(state.email + "")}>{state.email} <DocumentDuplicateIcon aria-hidden="true" className="size-4 zip-medium-text" /></button>
                          </p><br></br>
                          <p className="text-sm text-gray-500 inline">
                          <span className="inline text-sm">Proceed to our </span>
                            <Link
                              href="/dashboard"
                              className="inline-flex zip-fearlessness-text text-sm inline"
                            >
                              sandbox tools
                            </Link> to demo our payment flows or to top up your account balance for testing!
                          </p>

                        </div>

                      </div>
                    </>
                  }
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

                <button
                  type="button"
                  data-autofocus
                  // onClick={() => showModal(false)}
                  onClick={() => { showModal(false); toggleSitTight(); }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Dismiss
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* <Modal modalProps={modalProps} ></Modal> */}

      {/* </>
        :
       null
      } */}

      <div className="rounded-lg bg-white md:p-6">
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
            <UsersIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Choose an email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Optional"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              // defaultValue={email}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
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
            Choose an account type
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="accTypeZP"
                  name="accType"
                  type="radio"
                  value="zpv2"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                  defaultChecked
                />
                <label
                  htmlFor="accTypeZP"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full zip-lightest-bg px-3 py-1.5 text-xs font-medium "
                >
                  Zip Pay
                  {/* <ClockIcon className="h-4 w-4" /> */}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="accTypeZM"
                  name="accType"
                  type="radio"
                  value="zmv2"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"

                />
                <label
                  htmlFor="accTypeZM"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full zip-dark-bg text-white px-3 py-1.5 text-xs font-medium text-gray-600"

                //   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Zip Money
                  {/* <CheckIcon className="h-4 w-4" /> */}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="accTypeZPlus"
                  name="accType"
                  type="radio"
                  value="zplus"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"

                />
                <label
                  htmlFor="accTypeZPlus"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full zip-fearlessness-bg text-white px-3 py-1.5 text-xs font-medium "

                //   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Zip Plus
                  {/* <CheckIcon className="h-4 w-4" /> */}
                </label>
              </div>
            </div>
          </div>

          <div id="accType-error" aria-live="polite" aria-atomic="true">
            {state.errors?.accType &&
              state.errors.accType.map((error: string) => (
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
          href="/dashboard"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <SpinnerButton name="Create customer" state={isLoading} onClick={clientSubmit} type="submit" children="" />

      </div>


    </form>
  )
}






