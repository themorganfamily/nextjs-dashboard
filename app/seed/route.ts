import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const client = await db.connect();

// async function seedUsers() {
//   await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//   await client.sql`
//     CREATE TABLE IF NOT EXISTS users (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL,
//       key TEXT NOT NULL,
//       customerid UUID
//     );
//   `;

//   const insertedUsers = await Promise.all(
//     users.map(async (user) => {
//       const hashedPassword = await bcrypt.hash(user.password, 10);
//       return client.sql`
//         INSERT INTO users (id, name, email, password, key, customerid)
//         VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword},${user.key}, ${user.customerid})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );

//   return insertedUsers;
// }

// async function seedInvoices() {
//   await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//   await client.sql`
//     CREATE TABLE IF NOT EXISTS invoices (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       customer_id UUID NOT NULL,
//       amount INT NOT NULL,
//       captured_amount INT,
//       status VARCHAR(255) NOT NULL,
//       date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
//       checkout_id VARCHAR(255),
//       charge_id VARCHAR(255),
//       receipt_number INT,
//       product VARCHAR(255),
//       interest_free_months INT,
//       reference VARCHAR(255)
//     );
//   `;

//   // const insertedInvoices = await Promise.all(
//   //   invoices.map(
//   //     (invoice) => client.sql`
//   //       INSERT INTO invoices (customer_id, amount, status, date)
//   //       VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
//   //       ON CONFLICT (id) DO NOTHING;
//   //     `,
//   //   ),
//   // );

// //   // return insertedInvoices;
//   return {status: "success"}
// }

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
      mobile VARCHAR(255),
      image_url VARCHAR(255) NOT NULL,
      tokenised BOOLEAN NOT NULL,
      payment_token VARCHAR(255),
      account_id INT,
      consumer_id INT,
      customer_id UUID,
      account_type VARCHAR(255)
    );
  `;

  // const insertedCustomers = await Promise.all(
  //   customers.map(
  //     (customer) => client.sql`
  //       INSERT INTO customers (id, name, email, image_url)
  //       VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
  //       ON CONFLICT (id) DO NOTHING;
  //     `,
  //   ),
  // );
  return {status: "success"}
  // return insertedCustomers;
}

// async function seedRevenue() {
//   await client.sql`
//     CREATE TABLE IF NOT EXISTS revenue (
//       month VARCHAR(4) NOT NULL UNIQUE,
//       revenue INT NOT NULL
//     );
//   `;

//   const insertedRevenue = await Promise.all(
//     revenue.map(
//       (rev) => client.sql`
//         INSERT INTO revenue (month, revenue)
//         VALUES (${rev.month}, ${rev.revenue})
//         ON CONFLICT (month) DO NOTHING;
//       `,
//     ),
//   );

//   return insertedRevenue;
// }

export async function GET() {

  try {
    await client.sql`BEGIN`;
    //await seedUsers();
    await seedCustomers();
    // await seedInvoices();
    // await seedRevenue();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
