import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import {
  IQbPaymentLine,
  IQbPaymentsResponse,
} from '../interface/payment.interface';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getPayments(skip = 0, take = 1000): Observable<IQbPaymentsResponse> {
    return this.http.get<IQbPaymentsResponse>(
      `${this.url}/quickbooks/payments?skip=${skip}&take=${take}`,
    );
  }

  getPaymentsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/payments/count`);
  }

  getPaymentLines(idPayment: number): Observable<Array<IQbPaymentLine>> {
    return this.http.get<Array<IQbPaymentLine>>(
      `${this.url}/quickbooks/payments/lines/${idPayment}`,
    );
  }

  syncPayments(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/payments/sync`, {});
  }
}
