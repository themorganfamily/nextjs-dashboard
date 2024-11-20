import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { handleCheckoutResult } from '@/app/lib/actions';
// import { useRouter } from 'next/router';

import { Metadata } from 'next';
// import { createCheckout, redirectToOrders, createInvoice, getCheckout } from '@/app/lib/actions';
//import { redirect } from 'next/dist/server/api-utils';

export const metadata: Metadata = {
  title: 'Create Order',
};

export default async function Page(props: {
  searchParams?: Promise<{
    result?: string;
    checkoutId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const result = searchParams?.result || '';
  const checkoutId = searchParams?.checkoutId || '';
  
  let amount;

  if (result !== "" && checkoutId != "") {
    
    amount = await handleCheckoutResult(result, checkoutId); // user redirected away here on Approval and succesful charge
  
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
          { label: 'Orders', href: '/dashboard/invoices' },
          {
            label: 'Create Order',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} amount={amount}/>
      {/* Result: {result}<br></br> Checkout Id: {checkoutId} */}

    </main>
  );
}