import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IQuickbooksAuthUrl,
  IQuickbooksStatus,
  IQuickbooksCompanyInfo,
  IQbSyncLog,
  IQbSyncResult,
  IQbWebhookLog,
} from '../interface/quickbooks.interface';
import { CustomersService } from '../../customers/services/customers.service';
import { ItemsService } from '../../items/services/items.service';
import { InvoicesService } from '../../invoices/services/invoices.service';
import { AccountsService } from '../../accounts/services/accounts.service';

@Injectable({ providedIn: 'root' })
export class QuickbooksService {
  private url = environment.endpoint;

  constructor(
    private http: HttpClient,
    private customersService: CustomersService,
    private itemsService: ItemsService,
    private invoicesService: InvoicesService,
    private accountsService: AccountsService,
  ) {}

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

  // === Core (quickbooks/*) ===

  getCompanyInfo(): Observable<IQuickbooksCompanyInfo> {
    return this.http.get<IQuickbooksCompanyInfo>(`${this.url}/quickbooks/company-info`);
  }

  getSyncLogs(limit = 20): Observable<Array<IQbSyncLog>> {
    return this.http.get<Array<IQbSyncLog>>(`${this.url}/quickbooks/sync/logs?limit=${limit}`);
  }

  /** Ultimo sync para una entidad: Customer / Item / Invoice / Account / CDC */
  getSyncStatus(entity: string = 'Customer'): Observable<IQbSyncLog | null> {
    return this.http.get<IQbSyncLog | null>(
      `${this.url}/quickbooks/sync/status?entity=${entity}`,
    );
  }

  getWebhookLogs(limit = 20): Observable<Array<IQbWebhookLog>> {
    return this.http.get<Array<IQbWebhookLog>>(
      `${this.url}/quickbooks/webhook-logs?limit=${limit}`,
    );
  }

  /**
   * Sincroniza Accounts + Customers + Items + Invoices.
   * Orquesta los 4 endpoints individuales (el backend ya no expone /sync/all).
   * Si uno falla, los demas siguen — cada call atrapa su propio error.
   */
  async syncAll(): Promise<{
    accounts: IQbSyncResult | { error: string };
    customers: IQbSyncResult | { error: string };
    items: IQbSyncResult | { error: string };
    invoices: IQbSyncResult | { error: string };
  }> {
    const run = async (call: Observable<IQbSyncResult>) => {
      try {
        const r = await firstValueFrom(call);
        return r as IQbSyncResult;
      } catch (err: any) {
        return { error: err?.error?.message || err?.message || String(err) };
      }
    };
    const [accounts, customers, items, invoices] = await Promise.all([
      run(this.accountsService.syncAccounts()),
      run(this.customersService.syncCustomers()),
      run(this.itemsService.syncItems()),
      run(this.invoicesService.syncInvoices()),
    ]);
    return { accounts, customers, items, invoices };
  }
}
