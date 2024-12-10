import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon,ArrowPathIcon } from '@heroicons/react/24/outline';
// import { lusitana } from '@/app/ui/fonts';
// import { Revenue } from '@/app/lib/definitions';
import { fetchRevenue } from '@/app/lib/data';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() { // Make component async, remove the props
  const revenue = await fetchRevenue(); // Fetch data inside the component
  const chartHeight = 330;
  // NOTE: Uncomment this code in Chapter 7

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className={` relative w-full overflow-hidden md:col-span-5`}>
      <h2 className={`mb-4 text-lg md:text-xl`}>
          Important Updates
        </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" >
        
          </div>
        <div className="flex items-center pb-2 pt-6">
            <ArrowPathIcon className="h-5 w-5 text-gray-500" />
            <h3 className="ml-2 text-sm text-gray-500 ">Updated 01/01/2024</h3>
          </div>
      </div>
    </div>
  );
}
