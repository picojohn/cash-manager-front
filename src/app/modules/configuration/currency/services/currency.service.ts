import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICurrency } from '../interface/currency.interface';



@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private url = environment.endpoint
  constructor(private http: HttpClient) { }


  getCurrencys(): Observable<Array<ICurrency>> {
    return this.http.get<Array<ICurrency>>(`${this.url}/currencys`)
  }

  // public cambiarEstadosByid(id: number): Observable<Array<any>> {
  //   return this.http.get<Array<any>>(`${this.url}/cargos/estados/${id}`)
  // }


  newCurrency(currency: ICurrency): Observable<ICurrency> {
    return this.http.post<ICurrency>(`${this.url}/currencys`, currency)
  }


  editCurrency(currency: ICurrency): Observable<ICurrency> {
    return this.http.patch<ICurrency>(`${this.url}/currencys`, currency)
  }



}
