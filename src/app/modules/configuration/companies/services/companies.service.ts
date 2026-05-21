import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/companies`);
  }

  newCompany(company: any): Observable<any> {
    return this.http.post<any>(`${this.url}/companies`, company);
  }

  editCompany(company: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/companies`, company);
  }

  cambiarEstadosByidCompany(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/companies/estados/${id}`);
  }
}
