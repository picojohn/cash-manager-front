import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import {
  IQbBillPaymentLine,
  IQbBillPaymentsResponse,
} from '../interface/bill-payment.interface';

@Injectable({ providedIn: 'root' })
export class BillPaymentsService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getBillPayments(skip = 0, take = 1000): Observable<IQbBillPaymentsResponse> {
    return this.http.get<IQbBillPaymentsResponse>(
      `${this.url}/quickbooks/bill-payments?skip=${skip}&take=${take}`,
    );
  }

  getBillPaymentsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.url}/quickbooks/bill-payments/count`,
    );
  }

  getBillPaymentLines(idBillPayment: number): Observable<Array<IQbBillPaymentLine>> {
    return this.http.get<Array<IQbBillPaymentLine>>(
      `${this.url}/quickbooks/bill-payments/lines/${idBillPayment}`,
    );
  }

  syncBillPayments(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/bill-payments/sync`, {});
  }
}
