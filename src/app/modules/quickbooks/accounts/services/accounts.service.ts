import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import { IQbAccountsLocalResponse } from '../interface/account.interface';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getLocalAccounts(accountType?: string): Observable<IQbAccountsLocalResponse> {
    const qs = accountType ? `?type=${encodeURIComponent(accountType)}` : '';
    return this.http.get<IQbAccountsLocalResponse>(
      `${this.url}/quickbooks/accounts/local${qs}`,
    );
  }

  getLocalAccountsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/accounts/local/count`);
  }

  syncAccounts(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/accounts/sync`, {});
  }
}
