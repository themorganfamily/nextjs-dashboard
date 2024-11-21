import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceIFM({ product, interestFreeMonths }: { product: string, interestFreeMonths: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100': interestFreeMonths != '0',
          'bg-gray-100 ': product === 'zipPay',
          'bg-gray-100  ': product === 'zipPlus'
        },
      )}
    >

      {interestFreeMonths != '0' ? (
        <>
          {interestFreeMonths} Months Interest Free
          {/* <ClockIcon className="ml-1 w-4 text-gray-500" /> */}
        </>
      ) : null}

      {product === 'zipPay' ? (
        <>
          Interest Free Always
          {/* <ClockIcon className="ml-1 w-4 text-gray-500" /> */}
        </>
      ) : null}

{product === 'zipPlus' ? (
        <>
          Interest Free *
          {/* <ClockIcon className="ml-1 w-4 text-gray-500" /> */}
        </>
      ) : null}


    </span>
  );
}
