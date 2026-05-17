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

export interface IQbCustomersResponse {
  items: Array<IQbCustomer>;
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
