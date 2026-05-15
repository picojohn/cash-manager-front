import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  IQuickbooksAuthUrl,
  IQuickbooksStatus,
  IQuickbooksCompanyInfo,
  IQuickbooksCustomersResponse,
} from '../interface/quickbooks.interface';

@Injectable({
  providedIn: 'root',
})
export class QuickbooksService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  /** Devuelve la URL OAuth para conectar QB a la company actual */
  getConnectUrl(): Observable<IQuickbooksAuthUrl> {
    return this.http.get<IQuickbooksAuthUrl>(`${this.url}/auth/quickbooks/connect`);
  }

  /** Devuelve si la company actual ya tiene QB conectado */
  getStatus(): Observable<IQuickbooksStatus> {
    return this.http.get<IQuickbooksStatus>(`${this.url}/auth/quickbooks/status`);
  }

  /** Desconecta QB de la company actual */
  disconnect(): Observable<{ disconnected: boolean }> {
    return this.http.post<{ disconnected: boolean }>(`${this.url}/auth/quickbooks/disconnect`, {});
  }

  /** Info de la company conectada en QB (CompanyName, etc.) */
  getCompanyInfo(): Observable<IQuickbooksCompanyInfo> {
    return this.http.get<IQuickbooksCompanyInfo>(`${this.url}/quickbooks/company-info`);
  }

  /** Listado de customers desde QB (paginado) */
  getCustomers(start = 1, max = 10): Observable<IQuickbooksCustomersResponse> {
    return this.http.get<IQuickbooksCustomersResponse>(
      `${this.url}/quickbooks/customers?start=${start}&max=${max}`,
    );
  }
}
