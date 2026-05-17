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
  IQbSyncLog,
  IQbSyncResult,
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

  // === Sync (quickbooks/sync/*) ===

  syncCustomers(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/sync/customers`, {});
  }

  getSyncLogs(limit = 20): Observable<Array<IQbSyncLog>> {
    return this.http.get<Array<IQbSyncLog>>(`${this.url}/quickbooks/sync/logs?limit=${limit}`);
  }

  getSyncStatus(entity: string = 'Customer'): Observable<IQbSyncLog | null> {
    return this.http.get<IQbSyncLog | null>(
      `${this.url}/quickbooks/sync/status?entity=${entity}`,
    );
  }
}
