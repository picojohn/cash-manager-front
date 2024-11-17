// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, catchError, map, throwError } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { ICountry } from '../interface/countries.interface';
// import { ICurrency } from '../../currency/interface/currency.interface';



// @Injectable({
//   providedIn: 'root'
// })
// export class CountriesService {

//   private url = environment.endpoint
//   constructor(private http: HttpClient) { }


//   getCountries(): Observable<Array<ICountry>> {
//     return this.http.get<Array<ICountry>>(`${this.url}/countries`)
//   }

//   getCurrencies(): Observable<Array<ICurrency>> {
//     return this.http.get<Array<ICurrency>>(`${this.url}/currencys`)
//   }

//   // public cambiarEstadosByid(id: number): Observable<Array<any>> {
//   //   return this.http.get<Array<any>>(`${this.url}/cargos/estados/${id}`)
//   // }


//   newCountry(country: ICountry): Observable<ICountry> {
//     return this.http.post<ICountry>(`${this.url}/countries`, country)
//   }


//   editCountry(country: ICountry): Observable<ICountry> {
//     return this.http.patch<ICountry>(`${this.url}/countries`, country)
//   }



// }
