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

export interface IQuickbooksCustomer {
  Id: string;
  DisplayName: string;
  CompanyName?: string;
  Active: boolean;
  Balance: number;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  [key: string]: any;
}

export interface IQuickbooksCustomersResponse {
  customers: Array<IQuickbooksCustomer>;
  startPosition: number;
  maxResults: number;
  totalCount?: number;
  time: string;
}
