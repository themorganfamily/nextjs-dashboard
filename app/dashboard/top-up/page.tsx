import Form from '@/app/ui/customers/top-up-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { handleCheckoutResult } from '@/app/lib/actions';
// import { useRouter } from 'next/router';

import { Metadata } from 'next';
// import { createCheckout, redirectToOrders, createInvoice, getCheckout } from '@/app/lib/actions';
//import { redirect } from 'next/dist/server/api-utils';

export const metadata: Metadata = {
    title: 'Top-up Balance',
};

export default async function Page(props: {
    searchParams?: Promise<{
        email?: string;
        result?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const email = searchParams?.email || '';
    const result = searchParams?.result || '';

    let customer;

    if (result === "success") {
        console.log("here we go");
    }

    const customers = await fetchCustomers();

    //await redirectToZip();
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sandbox Tools', href: '/dashboard' },
                    {
                        label: 'Top-up Balance',
                        href: '/dashboard/top-up',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
            {/* Result: {result}<br></br> Checkout Id: {checkoutId} */}

        </main>
    );
}