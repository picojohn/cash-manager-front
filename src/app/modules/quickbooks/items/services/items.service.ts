import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import {
  IQbAccount,
  IQbItem,
  IQbItemCreate,
  IQbItemStockAdjust,
  IQbItemUpdate,
  IQbItemsResponse,
} from '../interface/item.interface';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getItems(skip = 0, take = 1000): Observable<IQbItemsResponse> {
    return this.http.get<IQbItemsResponse>(
      `${this.url}/quickbooks/items?skip=${skip}&take=${take}`,
    );
  }

  getItemsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/items/count`);
  }

  createItem(dto: IQbItemCreate): Observable<IQbItem> {
    return this.http.post<IQbItem>(`${this.url}/quickbooks/items`, dto);
  }

  updateItem(qbId: string, dto: IQbItemUpdate): Observable<IQbItem> {
    return this.http.patch<IQbItem>(`${this.url}/quickbooks/items/${qbId}`, dto);
  }

  adjustItemStock(qbId: string, dto: IQbItemStockAdjust): Observable<IQbItem> {
    return this.http.post<IQbItem>(
      `${this.url}/quickbooks/items/adjust-stock/${qbId}`,
      dto,
    );
  }

  syncItems(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/items/sync`, {});
  }

  /** Chart of accounts LIVE de QB. El modal de Item lo usa para los dropdowns. */
  getAccounts(accountType?: string): Observable<{ accounts: Array<IQbAccount> }> {
    const qs = accountType ? `?type=${encodeURIComponent(accountType)}` : '';
    return this.http.get<{ accounts: Array<IQbAccount> }>(
      `${this.url}/quickbooks/accounts${qs}`,
    );
  }
}
