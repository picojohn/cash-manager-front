import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import { IQbBillLine, IQbBillsResponse } from '../interface/bill.interface';

@Injectable({ providedIn: 'root' })
export class BillsService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getBills(skip = 0, take = 1000): Observable<IQbBillsResponse> {
    return this.http.get<IQbBillsResponse>(
      `${this.url}/quickbooks/bills?skip=${skip}&take=${take}`,
    );
  }

  getBillsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/bills/count`);
  }

  getBillLines(idBill: number): Observable<Array<IQbBillLine>> {
    return this.http.get<Array<IQbBillLine>>(`${this.url}/quickbooks/bills/lines/${idBill}`);
  }

  syncBills(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/bills/sync`, {});
  }
}
