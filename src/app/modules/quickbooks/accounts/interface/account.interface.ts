/** Interfaces del submodulo Accounts (snapshot local). */

export interface IQbAccountLocal {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  name: string;
  fullyQualifiedName: string;
  accountType: string;
  accountSubType: string;
  classification: string;
  description: string;
  currentBalance: number;
  currentBalanceWithSubAccounts: number;
  currencyRef: string;
  parentRef: string;
  subAccount: number;
  active: number;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbAccountsLocalResponse {
  items: Array<IQbAccountLocal>;
  total: number;
}
