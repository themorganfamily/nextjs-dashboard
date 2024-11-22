'use server';

import { custom, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import type { Customer, User } from '@/app/lib/definitions';
// import axios from 'axios';
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from 'next/server';

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
    status: z.enum(['authorised', 'captured'], {
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
const CreateCustomerAccount = FormSchema.omit({ id: true, date: true, status: true, amount: true, customerId: true });

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

export async function createZipUser(prevState: State, formData: FormData) {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "product": "zpv2",
        "env": "sandbox",
        "token": "AutomationTest"
    });

    if (formData.get("email") !== undefined && formData.get("email") !== "") {
        raw = JSON.stringify({
            "product": "zpv2",
            "env": "sandbox",
            "token": "AutomationTest",
            "email": "\"" + formData.get("email") + "\""
        });
    }

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
    };

    return fetch("https://zip-qa-createuser.internal.sand.au.edge.zip.co/createuser", requestOptions)
        .then((response) => response.json())
        .then((result) => { console.log(result); return result })
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

    const raw = JSON.stringify({
        "shopper": {
            "first_name": "Test1",
            "last_name": "Testington",
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
                "required": true
            }
        },
        "config": {
            "redirect_uri": "http://localhost:3000/dashboard/invoices/create",
            // "redirect_uri": "https://nextjs-dashboard-three-self-67.vercel.app/dashboard/invoices/create",
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

    // return await fetch("https://api.sandbox.zip.co/merchant/v1/checkouts", requestOptions)
    return await fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/checkouts", requestOptions)
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

    // return fetch("https://api.sandbox.zip.co/merchant/checkouts/" + id, requestOptions)
    return fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/checkouts/" + id, requestOptions)

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
            const charge = await createCharge(checkoutId, checkout.order.amount, checkout.config.capture);
            const newCustomerEmail = await createCustomer(undefined, charge);
            console.log("pastCreateCustomer");
            console.log(newCustomerEmail);
            const newCustomer = await getCustomer(newCustomerEmail);
            console.log(newCustomer);
            console.log(newCustomer?.id);

            const orderResult = await createInvoice(checkout, charge, newCustomer);
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
    const user = await getUser("user@nextmail.com");
    const validatedFields = CreateCustomerAccount.safeParse({
        email: formData.get("email"),
        accType: formData.get("accType"),
    });
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
            creditProductId: formData.get("creditProductId"),
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
            const customerResult = await createCustomer(zipUserResponse.email);
            redirect('/dashboard/customers?email=' + zipUserResponse.email);
        }
        // console.log("tets");
        const returnState: State = { message: null, errors: {}, isLoading: false };
        return returnState;
    }

}

export async function redirectToZip(prevState: State, formData: FormData) {

    console.log(formData);
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

}

export async function redirectToOrders() {
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function createCharge(checkoutId: string, amount: number, capture: boolean) {

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
        "authority": {
            "type": "checkout_id",
            "value": checkoutId
        },
        "reference": "ref_" + Math.floor(Math.random() * 10000),
        "amount": amount,
        "currency": "AUD",
        "capture": capture
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        cors: true
    };

    return fetch("https://api.sandbox.zipmoney.com.au/merchant/v1/charges", requestOptions)
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

export async function createCustomer(email?: string, charge?: any) {

    // console.log("in createInvoice function");
    // Prepare data for insertion into the database
    // const { customerId, amount, status } = validatedFields.data;

    // var dateTime = new Date().toISOString().split('T');
    // const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    // console.log(dateTime);
    // console.log(date);
    // Insert data into the database
    console.log("In createCustomer()");
    
    try {
        // console.log("in SQL try function");
        // let data;
        if (charge !== null && charge !== undefined) {
            console.log("Charge exists");
            //console.log(charge);
           // console.log(charge.customer.first_name);
            const name = charge.customer.first_name + ' ' + charge.customer.last_name;
            console.log(name + ' ' + charge.customer.email);
            await sql`
        INSERT INTO customers (name, email, image_url)
        VALUES ( ${name}, ${charge.customer.email}, '/customers/evil-rabbit.png')
      `;
            // console.log("Customer created");
            // console.log(data);
             return charge.customer.email;
        }
        else {
            console.log('Charge does not exist');
            console.log(email);
            await sql`
            INSERT INTO customers (name, email, image_url)
            VALUES ('Test User', ${email}, '/customers/evil-rabbit.png')
          `;
            // console.log("Customer created");
            // console.log(data);
             return email;

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

export async function createInvoice(checkout: any, charge: any, customer?: Customer) {
    // export async function createInvoice(customerId: string, amount: number, status: string) {

    // console.log("in createInvoice function");
    // Prepare data for insertion into the database
    // const { customerId, amount, status } = validatedFields.data;
    const amountInCents = charge.amount * 100;
    var dateTime = new Date().toISOString().split('T');
    const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    // console.log(dateTime);
    // console.log(date);
    // Insert data into the database
    try {
        // console.log("in SQL try function");
        console.log (customer?.id);
        if (customer !== null && customer !== undefined) {
            console.log("customer not null");
            console.log(customer);
            await sql`
        INSERT INTO invoices (customer_id, amount, status, date, checkout_id, charge_id, receipt_number, product, interest_free_months, reference)
        VALUES (${customer.id}, ${amountInCents}, ${charge.state}, ${date}, ${checkout.id}, ${charge.id}, ${charge.receipt_number}, ${charge.product}, ${charge.interest_free_months}, ${charge.reference})
      `;
        }
        else {
            console.log("customer is null");
            await sql`
            INSERT INTO invoices (customer_id, amount, status, date, checkout_id, charge_id, receipt_number, product, interest_free_months, reference)
            VALUES ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', ${amountInCents}, ${charge.state}, ${date}, ${checkout.id}, ${charge.id}, ${charge.receipt_number}, ${charge.product}, ${charge.interest_free_months}, ${charge.reference})
          `;
        }
    } catch (error) {
        // console.log("in SQL catch");
        // If a database error occurs, return a more specific error.
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
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
        creditProductId: formData.get('creditProductId'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
            isLoading: false,
        };
    }

    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
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
};

