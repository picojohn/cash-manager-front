/** Interfaces del submodulo Invoices. */

export interface IQbInvoice {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  docNumber: string;
  txnDate: string;
  dueDate: string;
  customerRef: string;
  customerName: string;
  totalAmt: number;
  balance: number;
  currencyRef: string;
  emailStatus: string;
  billEmail: string;
  printStatus: string;
  customerMemo: string;
  privateNote: string;
  exchangeRate: number;
  linesCount: number;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbInvoiceLine {
  id: number;
  idInvoice: number;
  idCompany: number;
  qbInvoiceId: string;
  qbLineId: string;
  lineNum: number;
  detailType: string;
  description: string;
  amount: number;
  itemRef: string;
  itemName: string;
  qty: number;
  unitPrice: number;
  taxCodeRef: string;
  serviceDate: string;
}

export interface IQbInvoicesResponse {
  items: Array<IQbInvoice>;
  total: number;
}

export interface IQbInvoiceLineInput {
  itemRef: string;
  qty: number;
  unitPrice?: number;
  description?: string;
  taxCodeRef?: string;
  qbLineId?: string;
}

export interface IQbInvoiceInput {
  customerRef: string;
  lines: Array<IQbInvoiceLineInput>;
  docNumber?: string;
  txnDate?: string;
  dueDate?: string;
  customerMemo?: string;
  privateNote?: string;
  billEmail?: string;
}

export interface IQbTaxCode {
  Id: string;
  Name: string;
  Description?: string;
  Active?: boolean;
  Taxable?: boolean;
}
