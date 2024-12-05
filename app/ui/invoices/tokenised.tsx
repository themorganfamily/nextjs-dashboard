import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Tokenised({ tokenised }: { tokenised: boolean}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-green-100 ': tokenised === true,
          'bg-gray-100 ': tokenised === false
        },
      )}
    >
      {tokenised === true ? (
        <>
          True
          {/* <ClockIcon className="ml-1 w-4 text-gray-500" /> */}
        </>
      ) : null}
      {tokenised === false ? (
        <>
          False
          {/* <span> {interestFreeMonths} Months Interest Free</span> */}
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
    </span>
  );
}
