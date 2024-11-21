import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100': status === 'authorised',
          'bg-green-200': status === 'captured',
        },
      )}
    >
      {status === 'authorised' ? (
        <>
          Authorised
          <ClockIcon className="ml-1 w-4 " />
        </>
      ) : null}
      {status === 'captured' ? (
        <>
          Complete
          <CheckIcon className="ml-1 w-4 " />
        </>
      ) : null}
    </span>
  );
}
