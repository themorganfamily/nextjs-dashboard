'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import type { User } from '@/app/lib/definitions';
import { CreateCustomer } from '../ui/invoices/buttons';

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
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an order status.',
    }),
    date: z.string(),
    email: z.string({
        invalid_type_error: 'Please enter a valid email.',
    }).email(),
    accType: z.enum(['zpv2', 'zmv2', "Both"], {
        invalid_type_error: 'Please select an account type.',
    }),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true, email: true, accType: true});
const CreateCustomerAccount = FormSchema.omit({ id: true, date: true, status: true, amount: true, customerId: true});

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
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

    if(formData.get("email") !== undefined && formData.get("email") !== "") {
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
        .then((result) => {console.log(result); return result})
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

    let capture = true;

    if (formData.get("status") === "pending") {
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
            "capture": capture
        },
        "metadata": {
            "platform": "Test"
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
    };

    return fetch("https://api.sandbox.zip.co/merchant/checkouts", requestOptions)
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
        const charge = await createCharge(checkoutId, checkout.order.amount, checkout.config.capture);
        const orderResult = await createInvoice("d6e15727-9fe1-4961-8c5b-ea44a9bd81aa", checkout.order.amount, "paid");
        console.log(orderResult);
        console.log(charge);

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
    });

    if (user !== undefined) {
        // Validate form using Zod
        validatedFields = CreateInvoice.safeParse({
            customerId: user.customerid,
            amount: formData.get("amount"),
            status: formData.get("status"),
        });
    } else {
        if (validatedFields.error !== undefined) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Missing Fields. Failed to Create Invoice.',
                isLoading: false
            };
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
        const returnState:State = {
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
       const returnState:State = { message: null, errors: {} , isLoading: false};
        return returnState;
    }

}

export async function redirectToZip(prevState: State, formData: FormData) {

    console.log(formData);
    const validForm = await validateForm(prevState, formData);
    if (validForm.message !== null && validForm.message !== undefined) {
        console.log("invalid " + validForm.message);
        const returnState:State = {
            errors: validForm.errors,
            message: validForm.message,
            isLoading: false
        };
        return returnState;
    }
    else {
        console.log("Valid ");
        const checkoutResponse = await createCheckout(prevState, formData)
        if (checkoutResponse.uri) {
            //await createInvoice(validatedFields.data.customerId, validatedFields.data.amount, validatedFields.data.status);
            redirect(checkoutResponse.uri)
        }
       // console.log("tets");
       const returnState:State = { message: null, errors: {} , isLoading: false};
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
        body: raw
    };

    return fetch("https://api.sandbox.zip.co/merchant/charges", requestOptions)
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

export async function createCustomer(email: string) {

    // console.log("in createInvoice function");
    // Prepare data for insertion into the database
    // const { customerId, amount, status } = validatedFields.data;
    
    // var dateTime = new Date().toISOString().split('T');
    // const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    // console.log(dateTime);
    // console.log(date);
    // Insert data into the database
    try {
       // console.log("in SQL try function");
        await sql`
        INSERT INTO customers (name, email, image_url)
        VALUES ("Tester Jones", ${email}, "/customers/evil-rabbit.png")
      `;
    } catch (error) {
        // console.log("in SQL catch");
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }
    console.log("Customer created");
    // return {
    //     message: 'Order created.',
    // };
    // Revalidate the cache for the invoices page and redirect the user.
    // revalidatePath('/dashboard/invoices');
    // redirect('/dashboard/invoices');
}

export async function createInvoice(customerId: string, amount: number, status: string) {

    // console.log("in createInvoice function");
    // Prepare data for insertion into the database
    // const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    var dateTime = new Date().toISOString().split('T');
    const date = dateTime[0] + " " + dateTime[1].split('Z')[0];
    // console.log(dateTime);
    // console.log(date);
    // Insert data into the database
    try {
       // console.log("in SQL try function");
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
        // console.log("in SQL catch");
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
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
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
            isLoading: false
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
    };
    message?: string | null;
    isLoading?: boolean | null;
};

