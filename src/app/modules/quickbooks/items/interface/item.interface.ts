/** Interfaces del submodulo Items. */

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

export interface IQbItemStockAdjust {
  qtyDiff: number;
  adjustAccountRef: string;
  memo?: string;
}

/** Account de QB (formato LIVE de QB, usado en dropdowns del modal de Items) */
export interface IQbAccount {
  Id: string;
  Name: string;
  FullyQualifiedName?: string;
  AccountType: string;
  AccountSubType?: string;
  Active?: boolean;
  CurrencyRef?: { value: string; name: string };
}
