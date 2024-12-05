// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  key: string;
  customerid: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  account_type: string;
  tokenised: boolean;
  consumer_id: string;
  account_id: string;
  customer_id: string;
};

export type CreditProduct = {
  id: string;
  name: string;
};

export type PaymentFlow = {
  id: string;
  name: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'authorised' or 'captured'.
  status: 'authorised' | 'captured';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestCustomer = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  account_type: string;
  date: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'authorised' | 'captured' | 'refunded' | 'cancelled' | 'partially refunded';
  reference: string;
  receipt_number: string;
  product: string;
  interest_free_months: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  account_type: string;
  total_invoices: number;
  total_authorised: number;
  total_captured: number;
  tokenised: boolean;
  consumer_id: string;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  account_type: string;
  tokenised: boolean;
};

export type CustomerField = {
  id: string;
  name: string;
  email: string;
  account_type: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  captured_amount: number;
  status: 'authorised' | 'captured';
  charge_id: string;
};
