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

/** Input para crear un Item */
export interface IQbItemCreate {
  name: string;
  type: 'Service' | 'NonInventory' | 'Inventory';
  incomeAccountRef: string;
  sku?: string;
  description?: string;
  unitPrice?: number;
  purchaseCost?: number;
  taxable?: boolean;
  active?: boolean;
  /** Solo aplican cuando type=Inventory */
  expenseAccountRef?: string;
  assetAccountRef?: string;
  qtyOnHand?: number;
  invStartDate?: string;
}

/** Input para ajustar stock de un Inventory item */
export interface IQbItemStockAdjust {
  qtyDiff: number;
  adjustAccountRef: string;
  memo?: string;
}

/** Input para editar un Item (sparse update, sin type) */
export interface IQbItemUpdate {
  name?: string;
  sku?: string;
  description?: string;
  unitPrice?: number;
  purchaseCost?: number;
  incomeAccountRef?: string;
  taxable?: boolean;
  active?: boolean;
}

/** Account del chart of accounts de QB */
export interface IQbAccount {
  Id: string;
  Name: string;
  FullyQualifiedName?: string;
  AccountType: string;
  AccountSubType?: string;
  Active?: boolean;
  CurrencyRef?: { value: string; name: string };
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

/** Linea de factura (input al crear/editar) */
export interface IQbInvoiceLineInput {
  itemRef: string;
  qty: number;
  unitPrice?: number;
  description?: string;
  taxCodeRef?: string;
  /** Para edit: id de la linea en QB. Si no viene, es linea nueva. */
  qbLineId?: string;
}

/** Input para crear o editar una Invoice */
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

/** TaxCode de QB */
export interface IQbTaxCode {
  Id: string;
  Name: string;
  Description?: string;
  Active?: boolean;
  Taxable?: boolean;
}

export interface IQbWebhookLog {
  id: number;
  idCompany: number;
  realmId: string;
  entityName: string;
  entityId: string;
  operation: string;
  status: string;
  errorMessage?: string;
  receivedAt: string;
  processedAt?: string;
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
