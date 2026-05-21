import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import {
  IQbInvoice,
  IQbInvoiceInput,
  IQbInvoiceLine,
  IQbInvoicesResponse,
  IQbTaxCode,
} from '../interface/invoice.interface';

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

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
      `${this.url}/quickbooks/invoices/lines/${idInvoice}`,
    );
  }

  createInvoice(dto: IQbInvoiceInput): Observable<IQbInvoice> {
    return this.http.post<IQbInvoice>(`${this.url}/quickbooks/invoices`, dto);
  }

  updateInvoice(qbId: string, dto: IQbInvoiceInput): Observable<IQbInvoice> {
    return this.http.patch<IQbInvoice>(`${this.url}/quickbooks/invoices/${qbId}`, dto);
  }

  syncInvoices(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/invoices/sync`, {});
  }

  getTaxCodes(): Observable<{ taxCodes: Array<IQbTaxCode> }> {
    return this.http.get<{ taxCodes: Array<IQbTaxCode> }>(
      `${this.url}/quickbooks/invoices/tax-codes`,
    );
  }
}
