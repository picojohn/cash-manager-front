/**
 * Interfaces para el modulo QuickBooks del frontend
 */

export interface IQuickbooksStatus {
  connected: boolean;
  realmId?: string;
  connectedAt?: string;
}

export interface IQuickbooksAuthUrl {
  authUrl: string;
}

export interface IQuickbooksCompanyInfo {
  CompanyInfo: {
    CompanyName: string;
    LegalName: string;
    Country: string;
    FiscalYearStartMonth: string;
    Email?: { Address: string };
    [key: string]: any;
  };
}

/** Customer en el snapshot local (camelCase, mapeado de QB) */
export interface IQbCustomer {
  id: number;
  idCompany: number;
  qbId: string;
  parentRef: string;
  job: number;
  syncToken: string;
  displayName: string;
  companyName: string;
  givenName: string;
  familyName: string;
  active: number;
  balance: number;
  primaryEmail: string;
  primaryPhone: string;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

/** Input para crear o editar un Customer (envia al backend) */
export interface IQbCustomerInput {
  displayName: string;
  companyName?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface IQbCustomersResponse {
  items: Array<IQbCustomer>;
  total: number;
}

/** Item (producto/servicio) en el snapshot local */
export interface IQbItem {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  name: string;
  sku: string;
  type: string;
  description: string;
  unitPrice: number;
  purchaseCost: number;
  taxable: number;
  active: number;
  trackQtyOnHand: number;
  qtyOnHand: number;
  parentRef: string;
  subItem: number;
  incomeAccountRef: string;
  expenseAccountRef: string;
  assetAccountRef: string;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbItemsResponse {
  items: Array<IQbItem>;
  total: number;
}

/** Invoice en el snapshot local */
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

/** Linea de un Invoice */
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

export interface IQbSyncLog {
  id: number;
  idCompany: number;
  entityType: string;
  syncType: string;
  status: string;
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

export interface IQbSyncResult {
  logId: number;
  status: string;
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  durationMs: number;
}
