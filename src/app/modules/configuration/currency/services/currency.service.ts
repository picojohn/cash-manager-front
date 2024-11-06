import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICountry, ICurrency, IGroup, ITax } from '../interface/currency.interface';



@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private url = environment.endpoint
  constructor(private http: HttpClient) { }


  /**
   * metodo del servicio para traer todos las monedas
   * @returns Array<ICurrency>
   */
  getCurrencys(): Observable<Array<ICurrency>> {
    return this.http.get<Array<ICurrency>>(`${this.url}/currencys`)
  }


  /**
   * metodo del servicio para crear una moneda
   * @param currency
   * @returns ICurrency
   */
  newCurrency(currency: ICurrency): Observable<ICurrency> {
    return this.http.post<ICurrency>(`${this.url}/currencys`, currency)
  }

  /**
   * metodo del servicio para editar una moneda
   * @param currency
   * @returns
   */
  editCurrency(currency: ICurrency): Observable<ICurrency> {
    return this.http.patch<ICurrency>(`${this.url}/currencys`, currency)
  }

  /**
   * metodo del servicio para eliminar una moneda por id
   * @param id
   * @returns
   */
  deleteCurrency(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/currencys/${id}`,)
  }

  //// paises

  /**
   * metodo del servicio para traer los paises
   * @returns Array<ICountry>
   */
  getCountries(): Observable<Array<ICountry>> {
    return this.http.get<Array<ICountry>>(`${this.url}/countries`)
  }

  /**
   * metodo del servicio para crear un pois
   * @param country
   * @returns Array<ICountry>
   */
  newCountry(country: ICountry): Observable<ICountry> {
    return this.http.post<ICountry>(`${this.url}/countries`, country)
  }

  /**
   * metodo del servicio para editar un pais
   * @param country
   * @returns
   */
  editCountry(country: ICountry): Observable<ICountry> {
    return this.http.patch<ICountry>(`${this.url}/countries`, country)
  }

  /**
   * metodo del servicio para eliminar un pais por id
   * @param id
   * @returns
   */
  deleteCountry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/countries/${id}`,)
  }

  ///// taxes


  /**
   * metodo del servicio para traer los taxes
   * @returns Array<ITax>
   */
  getTaxes(): Observable<Array<ITax>> {
    return this.http.get<Array<ITax>>(`${this.url}/taxes`)
  }

  /**
   * metodo del servicio para crear un Tax
   * @param tax
   * @returns Array<ITax>
   */
  newTax(tax: ITax): Observable<ITax> {
    return this.http.post<ITax>(`${this.url}/taxes`, tax)
  }

  /**
   * metodo del servicio para editar un tax
   * @param tax
   * @returns
   */
  editTax(tax: ITax): Observable<ITax> {
    return this.http.patch<ITax>(`${this.url}/taxes`, tax)
  }

  /**
   * metodo del servicio para eliminar un Tax por id
   * @param id
   * @returns
   */
  deleteTax(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/taxes/${id}`,)
  }

  ///// Groups


  /**
   * metodo del servicio para traer los Groups
   * @returns Array<IGroup>
   */
  getGroups(): Observable<Array<IGroup>> {
    return this.http.get<Array<IGroup>>(`${this.url}/groups`)
  }

  /**
   * metodo del servicio para crear un Groups
   * @param group
   * @returns Array<IGroup>
   */
  newGroup(group: IGroup): Observable<IGroup> {
    return this.http.post<IGroup>(`${this.url}/groups`, group)
  }

  /**
   * metodo del servicio para editar un Group
   * @param group
   * @returns
   */
  editGroup(group: IGroup): Observable<IGroup> {
    return this.http.patch<IGroup>(`${this.url}/groups`, group)
  }

  /**
   * metodo del servicio para eliminar un Group por id
   * @param id
   * @returns
   */
  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/groups/${id}`,)
  }

}
