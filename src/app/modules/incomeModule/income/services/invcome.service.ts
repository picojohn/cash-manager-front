import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ICategory, ICurrency, ITax, IType } from 'src/app/modules/configuration/application/interface/application.interface';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class IncomeService {

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
   * metodo del servicio para traer los taxes
   * @returns Array<ITax>
   */
  getTaxes(): Observable<Array<ITax>> {
    return this.http.get<Array<ITax>>(`${this.url}/taxes`)
  }


  getTypes(): Observable<Array<IType>> {
    return this.http.get<Array<IType>>(`${this.url}/types`)
  }

  /**
   * metodo para traer los taxes por idCompany
   * @param idCompany
   * @returns
   */
  getTypesIdCompany(idCompany: number): Observable<Array<IType>> {
    return this.http.get<Array<IType>>(`${this.url}/types/company/${idCompany}`)
  }

  /**
 * metodo del servicio para traer los Categories
 * @returns Array<ICategory>
 */
  getCategories(): Observable<Array<ICategory>> {
    return this.http.get<Array<ICategory>>(`${this.url}/categories`)
  }

  /**
   * metodo para traer las categorias por idCompany
   * @param idCompany
   * @returns
   */
  getCategoriesIdCompany(idCompany): Observable<Array<ICategory>> {
    return this.http.get<Array<ICategory>>(`${this.url}/categories/company/${idCompany}`)
  }


// productos
  getProducts(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/products`)
  }

  newProduct(product: any): Observable<any> {
      return this.http.post<any>(`${this.url}/products`, product)
    }




  // /**
  //  * metodo del servicio para crear una moneda
  //  * @param currency
  //  * @returns ICurrency
  //  */
  // newCurrency(currency: ICurrency): Observable<ICurrency> {
  //   return this.http.post<ICurrency>(`${this.url}/currencys`, currency)
  // }

  // /**
  //  * metodo del servicio para editar una moneda
  //  * @param currency
  //  * @returns
  //  */
  // editCurrency(currency: ICurrency): Observable<ICurrency> {
  //   return this.http.patch<ICurrency>(`${this.url}/currencys`, currency)
  // }

  // /**
  //  * metodo del servicio para eliminar una moneda por id
  //  * @param id
  //  * @returns
  //  */
  // deleteCurrency(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.url}/currencys/${id}`,)
  // }











}
