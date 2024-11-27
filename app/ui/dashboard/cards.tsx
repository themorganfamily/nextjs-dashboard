import { fetchCardData } from '@/app/lib/data';
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  DevicePhoneMobileIcon,
  UserPlusIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { CreateCheckout, CreateCustomer, CreateCustomerToolKit, GetMFA } from '../invoices/buttons';

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
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        {/* <div className="h-5 w-5 rounded-md bg-gray-100" /> */}
        <DevicePhoneMobileIcon className="h-5 w-5 text-gray-700" />
        {/* <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" /> */}
        <h3 className="ml-2 text-sm font-medium">Two-factor Authentication</h3>
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-8 pr-2 rounded-md bg-gray-100">
          <GetMFA/>
        </div>
        {/* <GetMFA/> */}
      </div>
    </div>
    
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        {/* <div className="h-5 w-5 rounded-md bg-gray-50" /> */}
        <UserPlusIcon className="h-5 w-5 text-gray-700" />
        {/* <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" /> */}
        <h3 className="ml-2 text-sm font-medium">Create Test Customers</h3>
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-100" />
        {/* <CreateCustomer/> */}
      </div>
    </div>
    
      {/* <GetMFA/> */}
      {/* <Card title="Create Test Customer" value={totalCapturedInvoices} type="collected" /> */}
      {/* <Card title="Get MFA Verification Code" value={totalAuthorisedInvoices} type="pending" /> */}
      
      <div
      className={`relative overflow-hidden rounded-xl bg-gray-50 p-2 shadow-sm`}
    >
      <div className="flex p-4">
      <CurrencyDollarIcon className="h-5 w-5 text-gray-700" />

        {/* <div className="h-5 w-5 rounded-md bg-gray-100" /> */}
        {/* <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" /> */}
        <h3 className="ml-2 text-sm font-medium">Test Payment Flows</h3>
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-100" />
        {/* <CreateCheckout/> */}
      </div>
    </div>
     
      {/* <Card
        title="Create Order"
        value={function () {return <CreateCheckout/>}}
        type="customers"
      /> */}
      <Card title={orderSummaryTitle} value={orderSummary} type="invoices" />
      
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
