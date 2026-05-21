import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import {
  IQbCustomer,
  IQbCustomerInput,
  IQbCustomersResponse,
} from '../interface/customer.interface';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getCustomers(skip = 0, take = 100): Observable<IQbCustomersResponse> {
    return this.http.get<IQbCustomersResponse>(
      `${this.url}/quickbooks/customers?skip=${skip}&take=${take}`,
    );
  }

  getCustomersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/customers/count`);
  }

  createCustomer(dto: IQbCustomerInput): Observable<IQbCustomer> {
    return this.http.post<IQbCustomer>(`${this.url}/quickbooks/customers`, dto);
  }

  updateCustomer(qbId: string, dto: IQbCustomerInput): Observable<IQbCustomer> {
    return this.http.patch<IQbCustomer>(`${this.url}/quickbooks/customers/${qbId}`, dto);
  }

  setCustomerActive(qbId: string, active: boolean): Observable<IQbCustomer> {
    return this.http.patch<IQbCustomer>(`${this.url}/quickbooks/customers/${qbId}`, {
      active,
    } as any);
  }

  syncCustomers(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/customers/sync`, {});
  }
}
