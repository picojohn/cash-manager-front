import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQbSyncResult } from '../../estado/interface/quickbooks.interface';
import { IQbVendorsResponse } from '../interface/vendor.interface';

@Injectable({ providedIn: 'root' })
export class VendorsService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getVendors(skip = 0, take = 1000): Observable<IQbVendorsResponse> {
    return this.http.get<IQbVendorsResponse>(
      `${this.url}/quickbooks/vendors?skip=${skip}&take=${take}`,
    );
  }

  getVendorsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.url}/quickbooks/vendors/count`);
  }

  syncVendors(): Observable<IQbSyncResult> {
    return this.http.post<IQbSyncResult>(`${this.url}/quickbooks/vendors/sync`, {});
  }
}
