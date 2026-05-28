import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import { IQbTransfersResponse } from '../interface/transfer.interface';

@Injectable({ providedIn: 'root' })
export class TransfersService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getTransfers(skip = 0, take = 1000): Observable<IQbTransfersResponse> {
    return this.http.get<IQbTransfersResponse>(
      `${this.url}/quickbooks/transfers?skip=${skip}&take=${take}`,
    );
  }

  getTransfersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/transfers/count`);
  }

  syncTransfers(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/transfers/sync`, {});
  }
}
