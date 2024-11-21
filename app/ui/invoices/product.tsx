import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceProduct({ product }: { product: string}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'zip-lightest-bg ': product === 'zipPay',
          'zip-dark-bg text-white': product === 'zipMoney',
          'zip-fearlessness-bg text-white': product === 'zipPlus',
        },
      )}
    >
      {product === 'zipPay' ? (
        <>
          Zip Pay
          {/* <ClockIcon className="ml-1 w-4 text-gray-500" /> */}
        </>
      ) : null}
      {product === 'zipMoney' ? (
        <>
          Zip Money 
          {/* <span> {interestFreeMonths} Months Interest Free</span> */}
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
       {product === 'zipPlus' ? (
        <>
          Zip Plus 
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
    </span>
  );
}
