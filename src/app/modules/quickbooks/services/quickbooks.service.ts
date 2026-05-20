import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IQuickbooksAuthUrl,
  IQuickbooksStatus,
  IQuickbooksCompanyInfo,
  IQbCustomer,
  IQbCustomersResponse,
  IQbCustomerInput,
  IQbItem,
  IQbItemsResponse,
  IQbItemCreate,
  IQbItemUpdate,
  IQbItemStockAdjust,
  IQbAccount,
  IQbInvoice,
  IQbInvoicesResponse,
  IQbInvoiceLine,
  IQbInvoiceInput,
  IQbTaxCode,
  IQbSyncLog,
  IQbSyncResult,
  IQbWebhookLog,
} from '../interface/quickbooks.interface';

@Injectable({
  providedIn: 'root',
})
export class QuickbooksService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  // === OAuth (auth/quickbooks/*) ===

  getConnectUrl(): Observable<IQuickbooksAuthUrl> {
    return this.http.get<IQuickbooksAuthUrl>(`${this.url}/auth/quickbooks/connect`);
  }

  getStatus(): Observable<IQuickbooksStatus> {
    return this.http.get<IQuickbooksStatus>(`${this.url}/auth/quickbooks/status`);
  }

  disconnect(): Observable<{ disconnected: boolean }> {
    return this.http.post<{ disconnected: boolean }>(`${this.url}/auth/quickbooks/disconnect`, {});
  }

  // === Data (quickbooks/*) ===

  getCompanyInfo(): Observable<IQuickbooksCompanyInfo> {
    return this.http.get<IQuickbooksCompanyInfo>(`${this.url}/quickbooks/company-info`);
  }

  /** Customers desde la DB local */
  getCustomers(skip = 0, take = 100): Observable<IQbCustomersResponse> {
    return this.http.get<IQbCustomersResponse>(
      `${this.url}/quickbooks/customers?skip=${skip}&take=${take}`,
    );
  }

  getCustomersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/customers/count`);
  }

  /** Crear un Customer (POST a QB → upsert local) */
  createCustomer(dto: IQbCustomerInput): Observable<IQbCustomer> {
    return this.http.post<IQbCustomer>(`${this.url}/quickbooks/customers`, dto);
  }

  /** Editar un Customer (sparse update en QB → upsert local) */
  updateCustomer(qbId: string, dto: IQbCustomerInput): Observable<IQbCustomer> {
    return this.http.patch<IQbCustomer>(`${this.url}/quickbooks/customers/${qbId}`, dto);
  }

  /** Activa/desactiva un Customer (atajo que solo envia { active }) */
  setCustomerActive(qbId: string, active: boolean): Observable<IQbCustomer> {
    return this.http.patch<IQbCustomer>(`${this.url}/quickbooks/customers/${qbId}`, {
      displayName: undefined,
      active,
    } as any);
  }

  /** Items desde la DB local */
  getItems(skip = 0, take = 1000): Observable<IQbItemsResponse> {
    return this.http.get<IQbItemsResponse>(
      `${this.url}/quickbooks/items?skip=${skip}&take=${take}`,
    );
  }

  getItemsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/items/count`);
  }

  /** Crear Item (POST a QB → upsert local) */
  createItem(dto: IQbItemCreate): Observable<IQbItem> {
    return this.http.post<IQbItem>(`${this.url}/quickbooks/items`, dto);
  }

  /** Editar Item (sparse update en QB → upsert local) */
  updateItem(qbId: string, dto: IQbItemUpdate): Observable<IQbItem> {
    return this.http.patch<IQbItem>(`${this.url}/quickbooks/items/${qbId}`, dto);
  }

  /** Ajusta stock de un Inventory item (crea Inventory Adjustment en QB) */
  adjustItemStock(qbId: string, dto: IQbItemStockAdjust): Observable<IQbItem> {
    return this.http.post<IQbItem>(
      `${this.url}/quickbooks/items/${qbId}/adjust-stock`,
      dto,
    );
  }

  /** Cuentas (chart of accounts) de QB. Filtro opcional por AccountType (Income, Expense, etc.) */
  getAccounts(accountType?: string): Observable<{ accounts: Array<IQbAccount> }> {
    const qs = accountType ? `?type=${encodeURIComponent(accountType)}` : '';
    return this.http.get<{ accounts: Array<IQbAccount> }>(
      `${this.url}/quickbooks/accounts${qs}`,
    );
  }

  // === Sync (quickbooks/sync/*) ===

  syncCustomers(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/sync/customers`, {});
  }

  syncItems(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/sync/items`, {});
  }

  /** Invoices desde la DB local */
  getInvoices(skip = 0, take = 1000): Observable<IQbInvoicesResponse> {
    return this.http.get<IQbInvoicesResponse>(
      `${this.url}/quickbooks/invoices?skip=${skip}&take=${take}`,
    );
  }

  getInvoicesCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/invoices/count`);
  }

  getInvoiceLines(idInvoice: number): Observable<Array<IQbInvoiceLine>> {
    return this.http.get<Array<IQbInvoiceLine>>(
      `${this.url}/quickbooks/invoices/${idInvoice}/lines`,
    );
  }

  syncInvoices(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/sync/invoices`, {});
  }

  /** Crear Invoice (POST a QB → upsert local) */
  createInvoice(dto: IQbInvoiceInput): Observable<IQbInvoice> {
    return this.http.post<IQbInvoice>(`${this.url}/quickbooks/invoices`, dto);
  }

  /** Editar Invoice (full update con SyncToken) */
  updateInvoice(qbId: string, dto: IQbInvoiceInput): Observable<IQbInvoice> {
    return this.http.patch<IQbInvoice>(`${this.url}/quickbooks/invoices/${qbId}`, dto);
  }

  /** TaxCodes de QB (TAX, NON, personalizados) */
  getTaxCodes(): Observable<{ taxCodes: Array<IQbTaxCode> }> {
    return this.http.get<{ taxCodes: Array<IQbTaxCode> }>(`${this.url}/quickbooks/tax-codes`);
  }

  /** Sincroniza Customers + Items + Invoices en orden */
  syncAll(): Observable<{
    customers: IQbSyncResult | { error: string };
    items: IQbSyncResult | { error: string };
    invoices: IQbSyncResult | { error: string };
  }> {
    return this.http.post<any>(`${this.url}/quickbooks/sync/all`, {});
  }

  getSyncLogs(limit = 20): Observable<Array<IQbSyncLog>> {
    return this.http.get<Array<IQbSyncLog>>(`${this.url}/quickbooks/sync/logs?limit=${limit}`);
  }

  /** Ultimos N eventos de webhooks recibidos (de la company autenticada) */
  getWebhookLogs(limit = 20): Observable<Array<IQbWebhookLog>> {
    return this.http.get<Array<IQbWebhookLog>>(
      `${this.url}/quickbooks/webhook-logs?limit=${limit}`,
    );
  }

  getSyncStatus(entity: string = 'Customer'): Observable<IQbSyncLog | null> {
    return this.http.get<IQbSyncLog | null>(
      `${this.url}/quickbooks/sync/status?entity=${entity}`,
    );
  }
}
