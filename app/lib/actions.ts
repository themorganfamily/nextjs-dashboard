'use server';

import { custom, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import type { Customer, User } from '@/app/lib/definitions';
import { fetchInvoiceById } from './data';
import { UUID } from 'crypto';
// import axios from 'axios';
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from 'next/server';

// export const maxDuration = 60;

const baseUrl = "https://6xj0tkb6.aue.devtunnels.ms:3001"

export async function getServerSideProps(context:any) {
    console.log(context.req.headers.referer)
  }

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['authorised', 'captured', 'cancelled', 'refunded', 'partially refunded', 'deleted', 'partially captured'], {
        invalid_type_error: 'Please select an order status.',
    }),
    date: z.string(),
    email: z.string({
        invalid_type_error: 'Please enter a valid email.',
    }).email(),
    accType: z.enum(['zpv2', 'zmv2', "zplus"], {
        invalid_type_error: 'Please select an account type.',
    }),
    creditProductId: z.string({
        invalid_type_error: 'Please select a credit product.',
    }),
});

const FormSchemaUpdate = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gte(0, { message: 'Refund amount must be less than or equal to the order captured amount.' }),
    status: z.enum(['authorised', 'captured', 'cancelled', 'refunded', 'partially refunded', 'deleted'], {
        invalid_type_error: 'Please select an order status.',
    }),
    date: z.string(),
    email: z.string({
        invalid_type_error: 'Please enter a valid email.',
    }).email(),
    accType: z.enum(['zpv2', 'zmv2', "Both"], {
        invalid_type_error: 'Please select an account type.',
    }),
    creditProductId: z.string({
        invalid_type_error: 'Please select a credit product.',
    }),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true, email: true, accType: true });
var CreateCustomerAccount = FormSchema.omit({ id: true, date: true, status: true, amount: true, customerId: true, creditProductId: true});

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

async function getCustomer(email: string): Promise<Customer | undefined> {
    try {
        const customer = await sql<Customer>`SELECT * FROM customers WHERE email=${email}`;
        return customer.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch customer.');
    }
}

async function getCustomerById(id: string): Promise<Customer | undefined> {
    try {
        const customer = await sql<Customer>`SELECT * FROM customers WHERE id=${id}`;
        return customer.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch customer.');
    }
}

async function getCustomerbyConsumerId(id: string): Promise<Customer | undefined> {
    try {
        const customer = await sql<Customer>`SELECT * FROM customers WHERE consumer_id=${id}`;
        return customer.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch customer.');
    }
}

export async function createZipUser(prevState: State, formData: FormData) {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "product": formData.get("accType"),
        "env": "sandbox",
        "token": "AutomationTest",
        "successCard": true
    });

    if (formData.get("email") !== undefined && formData.get("email") !== "") {
        raw = JSON.stringify({
            "product": formData.get("accType"),
            "env": "sandbox",
            "token": "AutomationTest",
            "email": formData.get("email"),
            "successCard": true
        });
    }

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
    };

    return fetch(baseUrl + "/createuser", requestOptions)
        .then((response) => response.json())
        .then((result) => { console.log(result); return result })
        .catch((error) => console.error(error));

}

export async function getVerificationCode(prevState: State, formData: FormData) {
    const myHeaders = new Headers();
    myHeaders.append("X-Zip-API-Key", "pFuBQbqMThx0W8JqH4JC6MhPCm0OEsIy");

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const verificationCodeResponse = await fetch("https://api.static.sand.au.edge.zip.co/v2/get-otp/61400000000", requestOptions)
        .then((response) => response.json())
        .then((result) => { console.log(result); return result })
        .catch((error) => { console.error(error); return error });

    const returnState: State = { message: null, errors: {}, isLoading: false, otp: verificationCodeResponse.otp };
    return returnState;
}

export async function selectPaymentFlow(id:string) {
    console.log("in select payment flow");
}

export async function handleTopUp(prevState: State, formData: FormData) {

    const email = formData.get("email");
    const amount = formData.get("amount");

    if (email !== undefined  && email !== null && email !== "") {

        console.log("email exists");

        if (amount !== undefined && amount !== null) {

            console.log("amount exists");
            
            const customer = await getCustomer(email+"");

            if (customer != undefined && customer != null) {
                console.log("customer exists");
                const balanceResult = await topUpBalance(customer.id, parseFloat(amount + ""));

                const returnState: State = { message: null, errors: {}, isLoading: false, modalVisible: false, title: 'Top up succesful!', modalMessage: 'Your new Zip account balance has been boosetd to allow for repeated testing!'  };
                return returnState;
                //revalidatePath('/dashboard/top-up');
               // redirect('/dashboard/top-up?result=success');
            }
            
        
        }

       
    }

    const returnState: State = { message: "errorsssss", errors: {}, isLoading: false, modalVisible: false };
    return returnState;
}

export async function handleUnlock(prevState: State, formData: FormData) {

    const email = formData.get("email");

    if (email !== undefined  && email !== null && email !== "") {

        console.log("email exists: " + email);

        // if (amount !== undefined && amount !== null) {

            // console.log("amount exists");
            
            const customer = await getCustomer(email+"");

            if (customer != undefined && customer != null) {
                console.log("customer exists");
                const unlockResult = await unlockAccount(customer.account_id);

                const returnState: State = { message: null, errors: {}, isLoading: false, modalVisible: false, title: 'Unlock succesful!', modalMessage: 'Your Zip account is now ready for testing!'  };
                return returnState;
                //revalidatePath('/dashboard/top-up');
               // redirect('/dashboard/top-up?result=success');
            }

            const returnState: State = { message: "yea errors", errors: {}, isLoading: false, modalVisible: false, title: 'Unlock failed!', modalMessage: 'Your Zip account is NOT ready for testing!'  };
                return returnState;
            
        
        // }

       
    }

    const returnState: State = { message: "errorsssss", errors: {}, isLoading: false, modalVisible: false };
    return returnState;
}

export async function unlockAccount(id:string) {
    const requestOptions = {
        method: "PATCH",
      };
      
      const unlockResponse =fetch(baseUrl + "/unlock/" + id, requestOptions)
        .then((response) => response.json())
        .then((result) => { console.log(result); return result })
        .catch((error) => { console.error(error); return error });

        const returnState: State = { message: null, errors: {}, isLoading: false, title: "Unlock succesful!" };
        return returnState;
}


export async function topUpBalance(id:string, amount?:number) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log("id: " + id)
    const customer = await getCustomerById(id);
    const accountId = customer?.account_id;
    const consumer_id = customer?.consumer_id

    console.log(accountId + " - " + consumer_id + " - " + amount)
    let raw;

    if (amount !== undefined && amount != null) {
        raw = JSON.stringify({
            "amount": amount,
            "classification": "repayment",
            "consumerId": consumer_id + "",
            "externalReference": "ref_" + Math.floor(Math.random() * 10000),
            "method": "immediate",
            "type": "credit",
            "accountId": accountId + ""
        });
    }
    else {
        raw = JSON.stringify({
            "amount": 100000,
            "classification": "repayment",
            "consumerId": consumer_id + "",
            "externalReference": "ref_" + Math.floor(Math.random() * 10000),
            "method": "immediate",
            "type": "credit",
            "accountId": accountId + ""
        });
    }

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
    };

    const topUpResponse = await fetch(baseUrl + "/topup/" + accountId, requestOptions)
        .then((response) => response.json())
        .then((result) => { console.log(result); return result })
        .catch((error) => { console.error(error); return error });

        revalidatePath('/dashboard/customers');
        // redirect('/dashboard/customers');
        const returnState: State = { message: null, errors: {}, isLoading: false };
        return returnState;
       
}

export async function fetchCustomerInfo(id:number) {
    const myHeaders = new Headers();
    myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies.3001=CfDJ8E0FHi1JCVNKrny-ARCYWxPREbZsadKtd6pODyBmQx4hU3YZFYltL-cPszXtAR8rBDyaXDaj3byX7LHg5xyKojsFPuPPaZSNA5yGz8UVrWKRgxu56frkxtTXoSXDRmc4ym4cAyoEu-H2MjlMfhot_9yupGG98_HjqJzSx-exN-iDZ-7EwqybKoJU_IjJNnst4EOvVSGqQMSQLMpIPGMFw4qvDxvtcG1APue-KNjFSGQXew0uSCcjfDPO1ZUQ4yMVPVZ7hjv4r_DS0bN8uXHSqvXj1uMimFLDui9NIzgu4pYp7sAjnPZDBKZ5PRM_HX5NhE6f-VR52jqImHk9cMy33imtv03SA_zzzz0PYXBcKaiVaGl8Ukxlyd_h82v3zSY2nUHbhWtkfJMPLPTNdK4K2iZkPro6FsNO1XZ9hqOrASv1stfEyQ5j3eV3vnWabJDaWsRRavSLMBsYPoJnz9t2sgVTBbc1vowdW-Y65zXAPYDx-HJkcO1GDXyhVGD_ik8E3jXy-iL1_0LF0uRViMZWx0STCpwXqRQC1ZJ1jPStOPbRpiU8MDZkvauPDSzHZ-qgwUjd8-KATSlvfand5GKQ3ar48oTfJJiWCs57tseLyqWJt6o_FKGCns2We3zxZIXNjIHNMe7uEp6jrJOlkE4zXZdqixuocEk-vJrtuXat5Wiv9quqU2sktq5Bw4mzQkjRhuJdAqaS9pXuzaS4fPu66SlcHZha1P0f4fs3ElSB1lMDmmIARhm1FdbsCXc-XOPFcYoPEdxtdEbGtNB6Ry6_UT6mNQHe7kcw-P_GS2m9eQtq7DYWtLhm-2iDTcyZLMyZRcaQq1zBX0D5NoQ3UH0Ytio6peA5oPFdU-vmJS7SOYnSlejbT4lhQcnf7Czqu9Ar68PTaX1hcwUASY0ZXiqKYAuLNQ9NzB2P5P0DoCtPnXvD");
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders
    };
    
    return fetch(baseUrl + "/customer/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => console.error(error));

 
}

export async function createCheckout(prevState: State, formData: FormData) {
    const user = await getUser("user@nextmail.com");

    const myHeaders = new Headers();
    if (user !== undefined) {
        myHeaders.append("Authorization", "Bearer " + user.key);
    }
    else {
        myHeaders.append("Authorization", "Bearer " + "IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=");
    }
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "https://nextjs-dashboard-three-self-67.vercel.app/")
    myHeaders.append("Cookie", "__cf_bm=2z0AA7JoIaDsVy22mw.c93_j.QOVV8GWoLLXfS.2caU-1732076480-1.0.1.1-FJnum73IjqqtV4iTvScyVHMBB9cQl9NrhvoLr5hf8Sd2ySGre14BRUWbJgOfzV3fngZqElLhsYGRCWDNRrUFAA");

    let capture = true;

    if (formData.get("status") === "authorised") {
        capture = false;
    }

    let tokenise = false;
    console.log(formData.get('tokenise'));
    if (formData.get('tokenise') === 'on') {
        tokenise = true
    }

    const raw = JSON.stringify({
        "shopper": {
            "first_name": "Test",
            "last_name": "User",
            "email": "test.tester@testing.com",
            "billing_address": {
                "first_name": "Test",
                "last_name": "Tester",
                "line1": "10 Spring St",
                "city": "Sydney",
                "state": "NSW",
                "postal_code": "2000",
                "country": "AU"
            }
        },
        "order": {
            "reference": "example_ref",
            "amount": formData.get("amount"),
            "currency": "AUD",
            "shipping": {
                "pickup": true
            },
            "items": [
                {
                    "name": "Test Item",
                    "type": "sku",
                    "reference": "1111111",
                    "quantity": 1,
                    "amount": "3000"
                }
            ]
        },
        "features": {
            "tokenisation": {
                "required": tokenise
            }
        },
        "config": {
            // "redirect_uri": "http://localhost:3000/dashboard/invoices/create",
            "redirect_uri": "https://nextjs-dashboard-three-self-67.vercel.app/dashboard/invoices/create",
            "capture": capture,
            "credit_product_id": formData.get("creditProductId")
        },
        "metadata": {
            "platform": "Test"
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        cors: true
    };

    return await fetch("https://api.sandbox.zip.co/merchant/checkouts", requestOptions)
    // return await fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/checkouts", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((error) => console.error(error));

}
//     console.log("inside createCheckout");
//     const user = await getUser("user@nextmail.com");

//     // const axios = require('axios');
//     console.log("past require Axios");
// let data = JSON.stringify({
//   "shopper": {
//     "first_name": "Test",
//     "last_name": "Testing",
//     "phone": "555",
//     "email": "testemail@tester.com",
//     "billing_address": {
//       "line1": "20 Test Ave",
//       "city": "TESTTOWN",
//       "state": "NSW",
//       "postal_code": "2517",
//       "country": "AU"
//     }
//   },
//   "order": {
//     "reference": "ref_2",
//     "amount": formData.get("amount"),
//     "currency": "AUD",
//     "shipping": {
//       "pickup": false,
//       "address": {
//         "line1": "20 Test Ave",
//         "city": "TESTTOWN",
//         "state": "NSW",
//         "postal_code": "2517",
//         "country": "AU"
//       }
//     }
//   },
//   "features": {
//     "tokenisation": {
//       "required": true
//     }
//   },
//   "config": {
//     "redirect_uri": "http://localhost:3000/dashboard/invoices/create"
//   }
// });

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://api.sandbox.zip.co/merchant/checkouts',
//   headers: { 
//     'Content-Type': 'application/json', 
//     'Authorization': 'Bearer IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=', 
//     'Zip-Version': '2017-03-01', 
//     'Cookie': '__cf_bm=2z0AA7JoIaDsVy22mw.c93_j.QOVV8GWoLLXfS.2caU-1732076480-1.0.1.1-FJnum73IjqqtV4iTvScyVHMBB9cQl9NrhvoLr5hf8Sd2ySGre14BRUWbJgOfzV3fngZqElLhsYGRCWDNRrUFAA'
//   },
//   data : data,
//   withCredentials: true,
// };

// console.log("Request prepared");
// console.log(config);

// return axios.request(config)
// .then((response:any) => {
//   console.log(JSON.stringify(response.data));
//   console.log(response.error?.data);
//   return response.data;
// })
// .catch((error:any) => {
//   console.log(error);
//   console.log(error.data);
//   return error.data;
// });


// const myHeaders = new Headers();
// if (user !== undefined) {
//     myHeaders.append("Authorization", "Bearer " + user.key);
// }
// else {
//     myHeaders.append("Authorization", "Bearer " + "IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=");
// }
// myHeaders.append("Content-Type", "application/json");
// myHeaders.append("Access-Control-Allow-Origin", "https://nextjs-dashboard-three-self-67.vercel.app/")
// myHeaders.append("Cookie", "__cf_bm=2z0AA7JoIaDsVy22mw.c93_j.QOVV8GWoLLXfS.2caU-1732076480-1.0.1.1-FJnum73IjqqtV4iTvScyVHMBB9cQl9NrhvoLr5hf8Sd2ySGre14BRUWbJgOfzV3fngZqElLhsYGRCWDNRrUFAA");

// let capture = true;

// if (formData.get("status") === "authorised") {
//     capture = false;
// }

// const raw = JSON.stringify({
//     "shopper": {
//         "first_name": "Test1",
//         "last_name": "Testington",
//         "email": "test.tester@testing.com",
//         "billing_address": {
//             "first_name": "Test",
//             "last_name": "Tester",
//             "line1": "10 Spring St",
//             "city": "Sydney",
//             "state": "NSW",
//             "postal_code": "2000",
//             "country": "AU"
//         }
//     },
//     "order": {
//         "reference": "example_ref",
//         "amount": formData.get("amount"),
//         "currency": "AUD",
//         "shipping": {
//             "pickup": true
//         },
//         "items": [
//             {
//                 "name": "Test Item",
//                 "type": "sku",
//                 "reference": "1111111",
//                 "quantity": 1,
//                 "amount": "3000"
//             }
//         ]
//     },
//     "features": {
//         "tokenisation": {
//             "required": true
//         }
//     },
//     "config": {
//         "redirect_uri": "http://localhost:3000/dashboard/invoices/create",
//         // "redirect_uri": "https://nextjs-dashboard-three-self-67.vercel.app/dashboard/invoices/create",
//         "capture": capture
//     },
//     "metadata": {
//         "platform": "Test"
//     }
// });

// const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     cors: true
// };

// return fetch("https://api.sandbox.zip.co/merchant/checkouts", requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//         console.log(result);
//         return result;
//     })
//     .catch((error) => console.error(error));

// // Revalidate the cache for the invoices page and redirect the user.
// // revalidatePath('/dashboard/invoices');
// //redirect('/dashboard/invoices');
// console.log('hmm')
//}

export async function getCheckout(id: string) {

    const user = await getUser("user@nextmail.com");

    const myHeaders = new Headers();
    if (user !== undefined) {
        myHeaders.append("Authorization", "Bearer " + user.key);
    }
    else {
        myHeaders.append("Authorization", "Bearer " + "IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=");
    }
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    return fetch("https://api.sandbox.zip.co/merchant/checkouts/" + id, requestOptions)
    // return fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/checkouts/" + id, requestOptions)

        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((error) => console.error(error));

    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    //redirect('/dashboard/invoices');
    console.log('hmm')
}

export async function handleCheckoutResult(result: string, checkoutId: string) {
    if (result === "approved") {
        // const user = await getUser("user@nextmail.com");
        // Place charge
        console.log("Checkout was " + result + " - " + checkoutId);
        const checkout = await getCheckout(checkoutId);

        if (checkout.state === 'approved') {
            //token
            var token: any = undefined;
            if (checkout.features.tokenisation.required) {
                token = await createToken(checkoutId);
            }
            const charge = await createCharge(checkoutId, checkout.order.amount, checkout.config.capture, "");


            //const newCustomerEmail = await createCustomer(undefined, charge);
            //console.log("pastCreateCustomer");
            //console.log(newCustomerEmail);
            var newCustomer = await getCustomerbyConsumerId(charge.customer.id); // FIX HERE
            var accountId = newCustomer?.account_id;
            
            console.log(token);

            if (newCustomer === undefined) {
                console.log("NO EXISTING CUSTOMER WITH THIS CONSUMER ID");
                var newCustomerEmail: any = undefined;
                if (token !== undefined) {
                    newCustomerEmail = await createCustomer(undefined, undefined, charge, checkout, token.value);
                    //newCustomer = await getCustomerbyConsumerId(charge.customer.id);
                    const newCustomerData = await fetchCustomerInfo(parseInt(charge.customer.id));
                    // if (newCustomer !== undefined){
                        newCustomer = await getCustomer(newCustomerEmail);
                        if (newCustomer !== undefined){
                            await updateCustomer(newCustomer.id, token.value, newCustomerData);
                        }
                    // }
                }
                else {
                    newCustomerEmail = await createCustomer(undefined, undefined, charge, checkout, "");
                    // newCustomer = await getCustomerbyConsumerId(charge.customer.id);
                    newCustomer = await getCustomer(newCustomerEmail);
                    const newCustomerData = await fetchCustomerInfo(parseInt(charge.customer.id));
                    if (newCustomer !== undefined){       
                        await updateCustomer(newCustomer.id, "", newCustomerData);
                    }
                }


                //console.log("pastCreateCustomer");
                newCustomer = await getCustomerbyConsumerId(charge.customer.id); // FIX HERE

                console.log(newCustomer);
                console.log(newCustomer?.id);
            }
            else {
                //Update customer with info
                const newCustomerData = await fetchCustomerInfo(parseInt(newCustomer.consumer_id));
                var customerId = newCustomerData.data.customer.customerId;
                var newAccountId = undefined;

                if(customerId === newCustomer.customer_id){
                    var accoutType = charge.product;

                    if (accoutType === "zipPay"){
                        accoutType = "ZIP_PAY";
                    }
                    else if (accoutType === "zipMoney"){
                        accoutType = "ZIP_MONEY";
                    }
                    else if (accoutType === "zipPlus"){
                        accoutType = "ZIP_PLUS";
                    }

                    // Check if the account used in the charge 

                    for(var i=0; i < newCustomerData.data.customer.consumerClassification.length; i++){
                        if(newCustomerData.data.customer.consumerClassification[i].classification === accoutType){
                            console.log("MATCH: loop " + i + " - account_id:" + newCustomerData.data.customer.consumerClassification[i].accountId)
                        }
                        else {
                            console.log("NOMATCH: loop " + i + " - account_id:" + newCustomerData.data.customer.consumerClassification[i].accountId)
                            newAccountId = newCustomerData.data.customer.consumerClassification[i].accountId;
                        }
                    }
                }

                if (newAccountId !== undefined){
                    if (accountId !== newAccountId) {
                        var newCustomerEmail = undefined;
                        if (token !== undefined) {
                            newCustomerEmail = await createCustomer(undefined, undefined, charge, checkout, token.value);
                            newCustomer = await getCustomer(newCustomerEmail);
                            if (newCustomer !== undefined) {
                                await updateCustomer(newCustomer.id, token.value, newCustomerData, newAccountId);
                            }
                        }
                        else {
                            newCustomerEmail = await createCustomer(undefined, undefined, charge, checkout, "");
                            newCustomer = await getCustomer(newCustomerEmail);
                            if (newCustomer !== undefined) {
                                await updateCustomer(newCustomer.id, "", newCustomerData, newAccountId);
                            }
                        }
                    }
                    else {
                        console.log("");
                        if (token !== undefined) {
                            await updateCustomer(newCustomer.id, token.value, newCustomerData, accountId);
                        }
                        else {
                            await updateCustomer(newCustomer.id, "", newCustomerData, accountId);
                        }
                    }
                }
                else {
                    if (token !== undefined) {
                        await updateCustomer(newCustomer.id, token.value, newCustomerData, accountId);
                    }
                    else {
                        await updateCustomer(newCustomer.id, "", newCustomerData, accountId);
                    }
                }     
            }

            const orderResult = await createInvoice(charge, checkout, newCustomer);
            console.log(orderResult);
            console.log(charge);
        }

        redirect('/dashboard/invoices');

    }
    else if (result !== "" && checkoutId != "") {
        // Do nothing
        console.log("Checkout was " + result + " - " + checkoutId);

        let amount;

        // Confirm status matches url params and persist order amount originally passed when returning with an unsuccesful result
        const checkout = await getCheckout(checkoutId);
        if (checkout !== undefined) {
            amount = checkout.order.amount;
        }
        return amount;
    }

}
//revalidatePath('/dashboard/invoices');

export async function validateCustomerForm(prevState: State, formData: FormData) {
    console.log(formData);
    const CreateCustomerAccountNoEmail = FormSchema.omit({ id: true, date: true, status: true, amount: true, customerId: true, creditProductId: true, email: true });
    var validatedFields = CreateCustomerAccountNoEmail.safeParse({
        email: formData.get("email"),
        accType: formData.get("accType"),
    });
    if(formData.get("email") !== undefined && formData.get("email") !== null && formData.get("email") !== ""){
        validatedFields = CreateCustomerAccount.safeParse({
            email: formData.get("email"),
            accType: formData.get("accType"),
        });
    }
    
    console.log("test" + validatedFields.error);

    if (validatedFields.error !== undefined) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
            isLoading: false
        };
    }



    // If form validation fails, return errors early. Otherwise, continue.
    // if (!validatedFields.success) {
    //     return {
    //         errors: validatedFields.error.flatten().fieldErrors,
    //         message: 'Missing Fields. Failed to Create Invoice.',
    //         isLoading: false
    //     };
    // }

    return { message: null, errors: {}, isLoading: true };


    // return {result: true}
}

export async function validateForm(prevState: State, formData: FormData) {
    console.log(formData);

    const user = await getUser("user@nextmail.com");
    let validatedFields = CreateInvoice.safeParse({
        customerId: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
        amount: formData.get("amount"),
        status: formData.get("status"),
        creditProductId: "",
    });

    if (user !== undefined) {
        // Validate form using Zod
        validatedFields = CreateInvoice.safeParse({
            customerId: user.customerid,
            amount: formData.get("amount"),
            status: formData.get("status"),
            creditProductId: "",
        });
    } else {
        if (validatedFields.error !== undefined) {
            console.log("Invalid (validateForm)");
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Missing Fields. Failed to Create Invoice.',
                isLoading: false
            };
        }
        else {
            console.log("Valid (validateForm)");
        }

    }

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
            isLoading: false
        };
    }

    return { message: null, errors: {}, isLoading: true };


    // return {result: true}
}

export async function closeModal() {

        const returnState: State = { modalVisible: false, title: 'Sit tight, this can take a minute', modalMessage: 'Your new Zip account is on the way!', email: null};
            return returnState;

        // console.log("tets");
}

export async function createUser(prevState: State, formData: FormData) {

    //console.log(formData);
   
    const validForm = await validateCustomerForm(prevState, formData);
    if (validForm.message !== null && validForm.message !== undefined) {
        //console.log("invalid " + validForm.message);
        const returnState: State = {
            errors: validForm.errors,
            message: validForm.message,
            isLoading: false
        };
        return returnState;
    }
    else {
        // console.log("Valid ");
        const zipUserResponse = await createZipUser(prevState, formData)
        if (zipUserResponse.email) {
            //await createInvoice(validatedFields.data.customerId, validatedFields.data.amount, validatedFields.data.status);
            const customerEmail = await createCustomer(zipUserResponse, formData);
            //redirect('/dashboard/customers/create?result=success&email=' + customerEmail);
            // ?page=1&query=' + zipUserResponse.email
            const returnState: State = { message: null, errors: {}, isLoading: false, modalVisible: true, title: `Account created succesfully!`, email: customerEmail, success: true };
            return returnState;
        }

        const returnState: State = { message: null, errors: {}, isLoading: false, modalVisible: true, title: `Account creation failed!`, modalMessage: 'Please try again shortly, there seems to be a downstream issue.', success: false};
            return returnState;

        // console.log("tets");
       
    }

}

export async function redirectToZip(prevState: State, formData: FormData) {

    console.log(formData);
    const paymentFlow = formData.get('paymentFlow');
    const validForm = await validateForm(prevState, formData);
    if (validForm.message !== null && validForm.message !== undefined) {
        console.log("Invalid (redirectToZip) " + validForm.message);
        const returnState: State = {
            errors: validForm.errors,
            message: validForm.message,
            isLoading: false
        };
        return returnState;
    }
    else {
        if (paymentFlow === "1" || paymentFlow === "3" ) {
            console.log("Valid (redirectToZip)");

            console.log("inside createCheckout");
            const checkoutResponse = await createCheckout(prevState, formData);

            // Revalidate the cache for the invoices page and redirect the user.
            // revalidatePath('/dashboard/invoices');
            //redirect('/dashboard/invoices');
            console.log('hmm')

            console.log("past request");

            if (checkoutResponse.uri) {
                //await createInvoice(validatedFields.data.customerId, validatedFields.data.amount, validatedFields.data.status);
                console.log(checkoutResponse.uri);
                redirect(checkoutResponse.uri)
            }
            // console.log("tets");
            const returnState: State = { message: null, errors: {}, isLoading: false };
            return returnState;
        }
        else {

            console.log("TOKENISED CHARGE");

            let capture = true;

            if (formData.get("status") === "authorised") {
                capture = false;
            }

            let amount = 0;

            if (formData.get('amount') !== undefined) {
                amount = parseFloat(formData.get('amount') +"");
            }

            let customer: any = undefined;
            let token = "";
            if (formData.get('customer') !== undefined) {
                customer = await getCustomerById(formData.get('customer')+ "")
               // getCustomer(formData.get('customer') + "");
                console.log(customer)
                if (customer !== undefined) {
                    token = customer.payment_token;
                }
            }
            console.log("", amount, capture, token);
            const charge = await createCharge("", amount, capture, token)

            const orderResult = await createInvoice(charge, null, customer);
            console.log(orderResult);
            console.log(charge);

            revalidatePath('/dashboard/invoices');
            redirect('/dashboard/invoices');

            const returnState: State = { message: null, errors: {}, isLoading: false };
            return returnState;
        }
    }

}

export async function redirectToOrders() {
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function createToken(checkoutId: string) {

    const user = await getUser("user@nextmail.com");

    const myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
    myHeaders.append("zip-header", "2017-03-01");
    myHeaders.append("idempotency-key", "");
    myHeaders.append("Authorization", "Bearer " + user?.key);

    const raw = JSON.stringify({
        "authority": {
            "type": "checkout_id",
            "value": checkoutId
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };
    return fetch("https://api.sandbox.zip.co/merchant/tokens", requestOptions)
    // return fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/tokens", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((error) => console.error(error));

}

export async function createCharge(checkoutId: string, amount: number, capture: boolean, token: string) {

    const user = await getUser("user@nextmail.com");


    //charge
    const myHeaders = new Headers();
    if (user !== undefined) {
        myHeaders.append("Authorization", "Bearer " + user.key);
    }
    else {
        myHeaders.append("Authorization", "Bearer " + "IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=");
    }
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "https://nextjs-dashboard-three-self-67.vercel.app/")
    myHeaders.append("Cookie", "__cf_bm=2z0AA7JoIaDsVy22mw.c93_j.QOVV8GWoLLXfS.2caU-1732076480-1.0.1.1-FJnum73IjqqtV4iTvScyVHMBB9cQl9NrhvoLr5hf8Sd2ySGre14BRUWbJgOfzV3fngZqElLhsYGRCWDNRrUFAA");
    var raw = undefined;
    if (token !== "") {
        raw = JSON.stringify({
            "authority": {
                "type": "account_token",
                "value": token
            },
            "reference": "ref_" + Math.floor(Math.random() * 10000),
            "amount": amount,
            "currency": "AUD",
            "capture": capture,
            "credit_product_id": 14
        });
    }
    else {
        raw = JSON.stringify({
            "authority": {
                "type": "checkout_id",
                "value": checkoutId
            },
            "reference": "ref_" + Math.floor(Math.random() * 10000),
            "amount": amount,
            "currency": "AUD",
            "capture": capture
        });
    }

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        cors: true
    };
    return fetch("https://api.sandbox.zip.co/merchant/charges", requestOptions)
    // return fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/charges", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((error) => {
            console.error(error);
            console.log(error);
        });

    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    //redirect('/dashboard/invoices');
    console.log('hmm')
}

export async function captureCharge(chargeId: string, amount: number) {

    console.log(chargeId + " " + amount);
    const user = await getUser("user@nextmail.com");

    const myHeaders = new Headers();
    if (user !== undefined) {
        myHeaders.append("Authorization", "Bearer " + user.key);
    }
    else {
        myHeaders.append("Authorization", "Bearer " + "IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=");
    }
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "https://nextjs-dashboard-three-self-67.vercel.app/")
    myHeaders.append("Cookie", "__cf_bm=2z0AA7JoIaDsVy22mw.c93_j.QOVV8GWoLLXfS.2caU-1732076480-1.0.1.1-FJnum73IjqqtV4iTvScyVHMBB9cQl9NrhvoLr5hf8Sd2ySGre14BRUWbJgOfzV3fngZqElLhsYGRCWDNRrUFAA");


    const raw = JSON.stringify({
        "charge_id": chargeId,
        "reference": "ref_" + Math.floor(Math.random() * 10000),
        "amount": amount,
        "currency": "AUD",
        "is_partial_capture": false
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        cors: true
    };
    return fetch("https://api.sandbox.zip.co/merchant/charges/" + chargeId + "/capture", requestOptions)
    // return fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/charges/" + chargeId + "/capture", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((error) => console.error(error));

    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    //redirect('/dashboard/invoices');
    console.log('hmm')
}

export async function cancelCharge(chargeId: string) {

    console.log(chargeId);
    const user = await getUser("user@nextmail.com");

    const myHeaders = new Headers();
    if (user !== undefined) {
        myHeaders.append("Authorization", "Bearer " + user.key);
    }
    else {
        myHeaders.append("Authorization", "Bearer " + "IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=");
    }
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "https://nextjs-dashboard-three-self-67.vercel.app/")
    myHeaders.append("Cookie", "__cf_bm=2z0AA7JoIaDsVy22mw.c93_j.QOVV8GWoLLXfS.2caU-1732076480-1.0.1.1-FJnum73IjqqtV4iTvScyVHMBB9cQl9NrhvoLr5hf8Sd2ySGre14BRUWbJgOfzV3fngZqElLhsYGRCWDNRrUFAA");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        cors: true
    };

    return fetch("https://api.sandbox.zip.co/merchant/charges/" + chargeId + "/cancel", requestOptions)
    // return fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/charges/" + chargeId + "/cancel", requestOptions)

        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((error) => console.error(error));

    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    //redirect('/dashboard/invoices');
    console.log('hmm')
}

export async function createCustomer(zipUser?: any, formData?: FormData, charge?: any, checkout?: any, token?: any) {

    // console.log("in createInvoice function");
    // Prepare data for insertion into the database
    // const { customerId, amount, status } = validatedFields.data;

    // var dateTime = new Date().toISOString().split('T');
    // const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    // console.log(dateTime);
    // console.log(date);
    // Insert data into the database
    console.log("In createCustomer()");
    var dateTime = new Date().toISOString().split('T');
    const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    var tokenised = false;
    try {
        // console.log("in SQL try function");
        // let data;
        if (charge !== null && charge !== undefined) {
            console.log("Charge exists");
            if (checkout.features.tokenisation.required !== undefined) {
                tokenised = checkout.features.tokenisation.required;
            }
            //console.log(charge);
            // console.log(charge.customer.first_name);
            const name = charge.customer.first_name + ' ' + charge.customer.last_name;
            console.log(name + ' ' + charge.customer.email + ' ' + charge.customer.id, charge.product, token);

            if (token !== undefined && token !== "") {
                await sql`
                INSERT INTO customers (name, email, image_url, date, tokenised, consumer_id, account_type, payment_token)
                VALUES ( ${name}, ${charge.customer.email}, '/customers/evil-rabbit.png', ${date}, ${tokenised} ,${parseInt(charge.customer.id)}, ${charge.product}, ${token})
            `;
            }
            else {
                await sql`
                INSERT INTO customers (name, email, image_url, date, tokenised, consumer_id, account_type)
                VALUES ( ${name}, ${charge.customer.email}, '/customers/evil-rabbit.png', ${date}, ${tokenised} ,${parseInt(charge.customer.id)}, ${charge.product})
            `;
            }
            // console.log("Customer created");
            // console.log(data);
            return charge.customer.email;
        }
        else {
            console.log('Charge does not exist');
            console.log(zipUser);
            var accType = formData?.get('accType');
            if (accType === "zpv2") {
                accType = "zipPay";
            }
            else if (accType === "zmv2") {
                accType = "zipMoney";
            }
            else if (accType === "zplus") {
                accType = "zipPlus";
            }
            await sql`
            INSERT INTO customers (name, email, image_url, date, tokenised, mobile, account_id, consumer_id, customer_id, account_type)
            VALUES ('Test User', ${zipUser.email}, '/customers/evil-rabbit.png', ${date}, ${false} ,${zipUser.mobile}, ${zipUser.accountId}, ${zipUser.consumerId}, ${zipUser.customerId}, ${accType?.toString()})
          `;
            // console.log("Customer created");
            // console.log(data);
            return zipUser.email;

        }

    } catch (error) {
        // console.log("in SQL catch");
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Customer acc.',
            error: error
        };
    }

    // return {
    //     message: 'Order created.',
    // };
    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    // redirect('/dashboard/invoices');
}

export async function updateCustomer(id: string, token: any, customerInfo?:any, accountId?:any) {

    console.log("In update Customer()");
    console.log(customerInfo);
    console.log("ACCOUNT_ID_RAW: " + accountId);

    if(accountId === undefined || accountId === ""){
        if (customerInfo !== undefined) {
            accountId  = customerInfo.data.customer.consumerClassification[0].accountId;
            console.log("ACCOUNT_ID_BACKUP: " + accountId);
        }
    }

   

    const existingCustomer = await getCustomerById(id);
    // var dateTime = new Date().toISOString().split('T');
    // const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    try {

        // if (charge !== null && charge !== undefined) {
        //     console.log("Charge exists");
         
    
            // const name = charge.customer.first_name + ' ' + charge.customer.last_name;
            // console.log(name + ' ' + charge.customer.email + ' ' + charge.customer.id, charge.product, token);

            if (customerInfo !== null) {
                console.log(customerInfo);
                console.log(customerInfo.data.customer.customerId);
                const customerId = customerInfo.data.customer.customerId;

                console.log(customerInfo.data.customer.email);
                const email = customerInfo.data.customer.email;

                // var accountId = undefined;

                //const accounts:any = customerInfo.data.customer.consumerClassification;

                

                if (token !== undefined && token !== "") {
                    await sql`
                    UPDATE customers
                    SET customer_id = ${customerId}, account_id = ${accountId}, email = ${email}, tokenised = true, payment_token = ${token}
                    WHERE id = ${id}
                `;
                }
                else {
                    await sql`
                    UPDATE customers
                    SET customer_id = ${customerId}, account_id = ${accountId}, email = ${email}
                    WHERE id = ${id}
                `;
                }
            }
            else {
                if (token !== undefined && token !== "") {
                    await sql`
                    UPDATE customers
                    SET tokenised = true, account_id = ${accountId}, payment_token = ${token}
                    WHERE id = ${id}
                `;
                }
            }

           
           
            
        }
        // else {
        //     console.log('Charge does not exist');
        //     console.log(zipUser);
        //     var accType = formData?.get('accType');
        //     if (accType === "zpv2") {
        //         accType = "zipPay";
        //     }
        //     else if (accType === "zmv2") {
        //         accType = "zipMoney";
        //     }
        //     else if (accType === "zplus") {
        //         accType = "zipPlus";
        //     }
        //     await sql`
        //     INSERT INTO customers (name, email, image_url, date, tokenised, mobile, account_id, consumer_id, customer_id, account_type)
        //     VALUES ('Test User', ${zipUser.email}, '/customers/evil-rabbit.png', ${date}, ${false} ,${zipUser.mobile}, ${zipUser.accountId}, ${zipUser.consumerId}, ${zipUser.customerId}, ${accType?.toString()})
        //   `;
        //     // console.log("Customer created");
        //     // console.log(data);
        //     return zipUser.email;

        // }

    catch (error) {
        // console.log("in SQL catch");
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Customer acc.',
            error: error
        };
    }

    // return {
    //     message: 'Order created.',
    // };
    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    // redirect('/dashboard/invoices');
}

export async function createInvoice( charge: any, checkout?: any, customer?: Customer) {
    // export async function createInvoice(customerId: string, amount: number, status: string) {

    // console.log("in createInvoice function");
    // Prepare data for insertion into the database
    // const { customerId, amount, status } = validatedFields.data;
    const amountInCents = parseInt(charge.amount * 100 + "");
    const chargeCapturedAmountInCents = parseInt(charge.captured_amount * 100 + "");
    console.log(amountInCents + " = " + chargeCapturedAmountInCents);
    var dateTime = new Date().toISOString().split('T');
    const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    // console.log(dateTime);
    // console.log(date);
    // Insert data into the database
    try {
        // console.log("in SQL try function");
        console.log(customer?.id);
        if (customer !== null && customer !== undefined) {
            console.log("customer not null");
            console.log(customer);

            if (checkout !== null && checkout !== undefined){
                await sql`
        INSERT INTO invoices (customer_id, amount, captured_amount, status, date, checkout_id, charge_id, receipt_number, product, interest_free_months, reference)
        VALUES (${customer.id}, ${amountInCents}, ${chargeCapturedAmountInCents} ,${charge.state}, ${date}, ${checkout.id}, ${charge.id}, ${charge.receipt_number}, ${charge.product}, ${charge.interest_free_months}, ${charge.reference})
      `;
            }
            else {
                await sql`
                INSERT INTO invoices (customer_id, amount, captured_amount, status, date, charge_id, receipt_number, product, interest_free_months, reference)
                VALUES (${customer.id}, ${amountInCents}, ${chargeCapturedAmountInCents} ,${charge.state}, ${date}, ${charge.id}, ${charge.receipt_number}, ${charge.product}, ${charge.interest_free_months}, ${charge.reference})
              `;
            }

            


        }
        else {
            console.log("customer is null");
            await sql`
            INSERT INTO invoices (customer_id, amount, captured_amount, status, date, checkout_id, charge_id, receipt_number, product, interest_free_months, reference)
            VALUES ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', ${amountInCents}, ${chargeCapturedAmountInCents} , ${charge.state}, ${date}, ${checkout.id}, ${charge.id}, ${charge.receipt_number}, ${charge.product}, ${charge.interest_free_months}, ${charge.reference})
          `;
        }
    } catch (error) {
        // console.log("in SQL catch");
        // If a database error occurs, return a more specific error.
        console.log(error);
        return {
            message: 'Database Error: Failed to Create Order.',
        };
    }
    console.log("Order created");
    // return {
    //     message: 'Order created.',
    // };
    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    // redirect('/dashboard/invoices');
}

// export async function createInvoice(formData: FormData) {
//     const { customerId, amount, status } = CreateInvoice.parse(Object.fromEntries(formData.entries()));
//     // const rawFormData = {
//     //   customerId: formData.get('customerId'),
//     //   amount: formData.get('amount'),
//     //   status: formData.get('status'),
//     // };

//     const amountInCents = amount * 100;
//     const date = new Date().toISOString().split('T')[0];

//     try {
//         await sql`
//             INSERT INTO invoices (customer_id, amount, status, date)
//             VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
//         `;
//     } catch (error) {
//         return {
//             message: 'Database Error: Failed to Create Invoice.',
//         };
//     }

//     revalidatePath('/dashboard/invoices');
//     redirect('/dashboard/invoices');
// }

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true, email: true, creditProductId: true, accType: true });

// ...

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
            isLoading: false,
        };
    }

    const invoice = await fetchInvoiceById(id);


    var { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    const invoiceAmountInCents = invoice.amount * 100;

    const newAmount = invoiceAmountInCents - amountInCents;

    if (newAmount < 0) {
        return {
            errors: {},
            message: 'Invalid amount. Capture must be less than or equal to the original order amount.',
            isLoading: false,
        };
    }

    var amountToSet = parseInt(amountInCents + "");

    if (status === 'refunded' && newAmount > 0) {
        status = 'partially refunded';
        amountToSet = newAmount;
    }

    if (status === 'captured' && newAmount > 0) {
        //status = 'partially captured';
    }


    if (status === 'captured') {
        const captureResponse = await captureCharge(invoice.charge_id, parseInt(amountToSet / 100 + ""));
        console.log("precapture")
        console.log(captureResponse);

        try {
            await sql`
                UPDATE invoices
                SET amount = ${amountToSet}, captured_amount = ${amountToSet}, status = ${status}
                WHERE id = ${id}
            `;
        } catch (error) {
            return {
                message: 'Database Error: Failed to Update Invoice.1',
            };
        }
    }
    else if (status === 'cancelled') {
        const cancelResponse = await cancelCharge(invoice.charge_id);
        console.log("preCancel")
        console.log(cancelResponse);

        try {
            await sql`
                UPDATE invoices
                SET status = ${status}
                WHERE id = ${id}
            `;
        } catch (error) {
            return {
                message: 'Database Error: Failed to Update Invoice.1',
            };
        }
    }
    else {
        try {
            await sql`
                UPDATE invoices
                SET captured_amount = ${newAmount}, status = ${status}
                WHERE id = ${id}
            `;
        } catch (error) {
            return {
                message: 'Database Error: Failed to Update Invoice.',
            };
        }
    }
    /// Is this the issue?


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string, prevState: State, formData: FormData) {
    // throw new Error('Failed to Delete Invoice');
    const user = await getUser("user@nextmail.com");
    const invoice = await fetchInvoiceById(id);
    var amountInCents = 0, newAmount = 0;

    const UpdateInvoice = FormSchemaUpdate.omit({ id: true, date: true, creditProductId: true, accType: true, email: true });
    console.log(formData.get('status'))

    var validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
            isLoading: false,
        };
    }

    var amount = validatedFields.data?.amount;
    if (amount !== undefined && amount !== null) {
        amountInCents = amount * 100;
        const invoiceAmountInCents = invoice.captured_amount * 100;

        newAmount = invoiceAmountInCents - amountInCents;
        console.log(invoiceAmountInCents + " - " + amountInCents);
        console.log(newAmount);
        validatedFields = UpdateInvoice.safeParse({
            customerId: formData.get('customerId'),
            amount: newAmount,
            status: formData.get('status'),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Failed to Update Order.',
                isLoading: false,
            };
        }
    }



    try {


        console.log("inside delet try");
        const myHeaders = new Headers();
        if (user !== undefined) {
            myHeaders.append("Authorization", "Bearer " + user.key);
        }
        else {
            myHeaders.append("Authorization", "Bearer " + "IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=");
        }
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Origin", "https://nextjs-dashboard-three-self-67.vercel.app/")
        myHeaders.append("Cookie", "__cf_bm=2z0AA7JoIaDsVy22mw.c93_j.QOVV8GWoLLXfS.2caU-1732076480-1.0.1.1-FJnum73IjqqtV4iTvScyVHMBB9cQl9NrhvoLr5hf8Sd2ySGre14BRUWbJgOfzV3fngZqElLhsYGRCWDNRrUFAA");


        const raw = JSON.stringify(
            {
                "charge_id": invoice.charge_id,
                "reason": "Test Reason Code",
                "amount": amountInCents / 100
            }
        );

        console.log(raw);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            cors: true
        };

        const refundResponse = await fetch("https://api.sandbox.zip.co/merchant/refunds", requestOptions)
        // const refundResponse = await fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/refunds", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                return result;
            })
            .catch((error) => console.error(error));
        // console.log(refundResponse);



        if (newAmount !== 0) {

            await sql`
                UPDATE invoices
                SET captured_amount = ${newAmount}, status = 'partially refunded'
                WHERE id = ${id}
            `;
        }
        else {
            // await sql`DELETE FROM invoices WHERE id = ${id}`;
            await sql`
                UPDATE invoices
                SET captured_amount = ${newAmount}, status = 'refunded'
                WHERE id = ${id}
            `;
        }

        // revalidatePath('/dashboard/invoices');
        // redirect('/dashboard/invoices');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function oldDeleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

export async function deleteCustomer(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
        redirect('/dashboard/customers');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        email?: string[];
        accType?: string[];
        creditProductId?: string[];

    };
    message?: string | null;
    isLoading?: boolean | null;
    otp?: string | null;
    modalVisible?: boolean | null;
    title?: string | null;
    email?: string | null;
    modalMessage?: string | null;
    success?: boolean | null;
};

