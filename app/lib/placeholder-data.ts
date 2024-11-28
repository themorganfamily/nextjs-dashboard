// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
    key: 'IKGdNiDHGs9AMoI+VY4wSZ0235uC9c2cZYMX+SbVx9I=',
    customerid: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  }
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'authorised',
    date: '2022-12-06 13:59:59',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'authorised',
    date: '2022-12-06 23:50:59',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'captured',
    date: '2022-12-06 23:59:59',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { users, customers, invoices, revenue };
