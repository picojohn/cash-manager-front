import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IModule, ISubModule } from '../interface/modulesSub.interface';



@Injectable({
  providedIn: 'root'
})
export class ModulesSubService {

  private url = environment.endpoint
  constructor(private http: HttpClient) { }

//  moduelos
  getModulesAll(): Observable<Array<IModule>> {
    return this.http.get<Array<IModule>>(`${this.url}/modules`)
  }

  // getCurrencies(): Observable<Array<ICurrency>> {
  //   return this.http.get<Array<ICurrency>>(`${this.url}/currencys`)
  // }

  // // public cambiarEstadosByid(id: number): Observable<Array<any>> {
  // //   return this.http.get<Array<any>>(`${this.url}/cargos/estados/${id}`)
  // // }


  // newCountry(country: ICountry): Observable<ICountry> {
  //   return this.http.post<ICountry>(`${this.url}/countries`, country)
  // }


  // editCountry(country: ICountry): Observable<ICountry> {
  //   return this.http.patch<ICountry>(`${this.url}/countries`, country)
  // }


// submodulos

getSubModulesAll(): Observable<Array<ISubModule>> {
  return this.http.get<Array<ISubModule>>(`${this.url}/subModules`)
}


}
