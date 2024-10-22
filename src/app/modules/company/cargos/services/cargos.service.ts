import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICargo } from '../interface/cargos.interface';



@Injectable({
  providedIn: 'root'
})
export class CargosService {

  private url = environment.endpoint
  constructor(private http: HttpClient) { }


  public getCargos(): Observable<Array<ICargo>> {
    return this.http.get<Array<ICargo>>(`${this.url}/cargos`)
  }
  public cambiarEstadosByid(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/cargos/estados/${id}`)
  }

  /**
   * metodo del servicio de cargos para crear uno
   * @param cargo
   * @returns ICargo
   */
  nuevoCargo(cargo: ICargo): Observable<ICargo> {
    return this.http.post<ICargo>(`${this.url}/cargos`, cargo)
  }

  /**
   * metodo del servicio de cargos para editar un proceso
   * @param cargo
   * @returns ICargo
   */
  editarCargo(cargo: ICargo): Observable<ICargo> {
    return this.http.patch<ICargo>(`${this.url}/cargos`, cargo)
  }



}
