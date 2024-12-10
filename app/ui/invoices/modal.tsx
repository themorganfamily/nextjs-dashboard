'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckCircleIcon, ClockIcon, DocumentDuplicateIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { boolean } from 'zod';

export default function Modal(modalProps:any) {
   
    var showMod:boolean = false;
  const [modalVisible, showModal] = useState(modalProps.modalProps.showModal);

  if  (modalVisible) {
    showMod = modalVisible;
  }

  const copyEmail = async (email: string) => {
    navigator.clipboard.writeText(email);
  }
//   console.log(modalProps);
//   console.log(modalProps.modalProps.email + ' here ----');
   // console.log(modalVisibleVal)
//   if(modalVisibleVal.modalVisibleVal === true){
//     showModal(true)
//   }
//   else {
//     showModal(true)

// if(!modalVisible && modalVisibleVal){
//     type Timer = ReturnType<typeof setTimeout>

//     const timer: Timer = setTimeout(() => {

//       showModal(modalVisibleVal.modalVisibleVal);
//       modalVisibleVal = false;

//     }, 100)
// }

  return (
    <Dialog id="confimrationModal" open={showMod} onClose={showModal} className="relative z-10">
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
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full zip-lightest-bg sm:mx-0 sm:size-10">
                  <CheckCircleIcon aria-hidden="true" className="size-6 zip-dark-text" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900 mt-2">
                    {modalProps.modalProps.title} 
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm flex text-gray-500">
                    Your account username is <button className='zip-medium-text flex items-center gap-1 pl-1' onClick={() => copyEmail(modalProps.modalProps.email)}>{modalProps.modalProps.email} <DocumentDuplicateIcon aria-hidden="true" className="size-4 zip-medium-text" /></button>
                    </p>
                    <p className="text-sm text-gray-500 pt-3">
                    Proceed to our tooklit to demo our payment flows or to top up your test account balance.
                    </p>
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

              <button
                type="button"
                data-autofocus
                onClick={() => showModal(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
