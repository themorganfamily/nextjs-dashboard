// import Pagination from '@/app/ui/invoices/pagination';
// import { fetchInvoicesPages } from '@/app/lib/data';
// import Search from '@/app/ui/search';
// import Table from '@/app/ui/invoices/table';
// import { CreateInvoice, CreateCheckout } from '@/app/ui/invoices/buttons';
// import { lusitana } from '@/app/ui/fonts';
// import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
// import { Suspense } from 'react';
// import { useRouter } from "next/router";
import Link from "next/link";

export default async function Page() {
    // Server-side Modal

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Are you sure?</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-lg text-gray-500">Deleting this order will permenantly remove it from your order history.</p>
                    </div>
                    <div className="flex justify-center mt-4">

                        {/* Navigates back to the base URL - closing the modal */}
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Close
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}

