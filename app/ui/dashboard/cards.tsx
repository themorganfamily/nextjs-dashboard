import { fetchCardData } from '@/app/lib/data';
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  DevicePhoneMobileIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  MapIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { CreateCheckout, CreateCustomer, CreateCustomerToolKit, GetMFA } from '../invoices/buttons';
import Link from 'next/link';
import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalCapturedInvoices,
    totalAuthorisedInvoices,
  } = await fetchCardData();

  const orderSummaryTitle = "Total orders (" + numberOfInvoices + ")";
  const orderSummary = totalCapturedInvoices
  return (
    <>
    {/* <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-1 shadow-sm hover:bg-gray-100 hover:text-gray-600`}
    >

    
    </div>

    <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-1 shadow-sm hover:bg-gray-100 hover:text-gray-600`}
    >

    
    </div>

    <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-1 shadow-sm hover:bg-gray-100 hover:text-gray-600`}
    >

     
    </div> */}
    {/* <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-3 shadow-sm hover:bg-gray-50 hover:text-gray-800`}
    > */}

      {/* <div className="flex items-center justify-center truncate rounded-xl bg-white h-80"> */}
        {/* <div className="pr-2 rounded-md bg-gray-100"> */}
        <Link
          href="/dashboard/customers/create"
          // className=" rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-black-100 hover:shadow-md h-40"
          className=" rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-gray-50 hover:shadow-black-100 hover:shadow-md h-40"
        >
         Create customer <UserPlusIcon className="h-7 md:mr-2 ml-4 justify-end" />
        </Link>
         
        {/* </div> */}
      {/* </div> */}
{/*     
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-3 shadow-sm hover:bg-gray-50 hover:text-gray-800`}
    > */}

      {/* <div className="flex items-center justify-center truncate rounded-xl bg-white h-80"> */}
        {/* <div className="pr-2 rounded-md bg-gray-100"> */}
        <Link
          href="/dashboard/top-up"
          // className="rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-slate-50 hover:bg-slate-100 hover:shadow-black-100 hover:shadow-md h-40"
          className="rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-gray-50  hover:shadow-black-100 hover:shadow-md h-40"

       >
          Top up balance <CurrencyDollarIcon className="h-7 md:mr-2 ml-4 justify-end" />
        </Link>
         
        {/* </div> */}
      {/* </div> */}
    {/* </div> */}
    


      {/* <div className="flex items-center justify-center truncate rounded-xl bg-white h-80"> */}
        {/* <div className="pr-2 rounded-md bg-gray-100"> */}
        <Link
          href="/dashboard/customers/create"
          // className="rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-slate-100 hover:bg-slate-200 hover:shadow-black-100 hover:shadow-md h-40"
          className="rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-gray-50  hover:shadow-black-100 hover:shadow-md h-40"

       >
          Unlock customer <LockOpenIcon className="h-7 md:mr-2 ml-4 justify-end" />
        </Link>
         
        {/* </div> */}
      {/* </div> */}
   
 

      {/* <div className="flex items-center justify-center truncate rounded-xl bg-white h-80"> */}
        {/* <div className="pr-2 rounded-md bg-gray-100"> */}
        <Link
          href="/dashboard/invoices/create"
          // className="rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-slate-200 hover:bg-slate-300 hover:shadow-black-100 hover:shadow-md h-40"
          className="rounded-xl shadow-sm flex items-center justify-center truncate rounded-xl bg-gray-50  hover:shadow-black-100 hover:shadow-md h-40"

        >
          Demo payment flows <MapIcon className="h-7 md:mr-2 ml-4 justify-end" />
        </Link>
         
        {/* </div> */}
      {/* </div> */}
   


    {/* <Card title={orderSummaryTitle} value={orderSummary} type="invoices" /> */}
      {/* <GetMFA/> */}
      
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
