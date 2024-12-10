import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { handleCheckoutResult } from '@/app/lib/actions';
import Modal from '@/app/ui/invoices/modal';


import { Metadata } from 'next';
// import { createCheckout, redirectToOrders, createInvoice, getCheckout } from '@/app/lib/actions';
//import { redirect } from 'next/dist/server/api-utils';

// export const metadata: Metadata = {
//     title: 'Create Customer',
// };

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
    var showModal:boolean = false;
    if (email !== "" && result !=="") {
        console.log(email);
        showModal = true;
    }
    const customers = await fetchCustomers();

    const modalProps = {showModal: showModal, email: email}

    // const pathname = usePathname();
    
    return (
        <main>
            {/* <Modal modalProps={modalProps} ></Modal> */}
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sandbox Tools', href: '/dashboard' },
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