/**
 * Interfaces del submodulo Estado / core de QuickBooks (OAuth, sync logs, webhook logs).
 * Las interfaces compartidas (IQbSyncResult) viven aqui y se importan desde otros submodulos.
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

/** Resultado generico de un sync. Lo usan todos los submodulos como tipo de retorno. */
export interface IQbSyncResult {
  logId: number;
  status: string;
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  durationMs: number;
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
