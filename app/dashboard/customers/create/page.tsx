import Form from '@/app/ui/customers/create-form';
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
    title: 'Create Customer',
};

export default async function Page(props: {
    searchParams?: Promise<{
        email?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const email = searchParams?.email || '';

    let customer;

    if (email !== "") {

        // customer = await createCustomer(email); // user redirected away here on Approval and succesful charge

        // Confirm status matches url params and persist order amount originally passed when returning with an unsuccesful result
        // const checkout = await getCheckout(checkoutId);
        // if(result !== "cancelled" && amount !== undefined) {
        //   const checkout = await getCheckout(checkoutId);
        //   amount = checkout.order.amount;
        // }
        // if (searchParams !== undefined && result !== undefined && checkoutId !== undefined) {
        //   delete searchParams.result;
        //   delete searchParams.checkoutId;
        //   // const router = useRouter();
        //   // router.replace("/dashboard/invoices/create");
        // }



    }


    const customers = await fetchCustomers();

    //await redirectToZip();
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Create Customer',
                        href: '/dashboard/customers/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
            {/* Result: {result}<br></br> Checkout Id: {checkoutId} */}

        </main>
    );
}