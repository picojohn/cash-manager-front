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

  newModule(module: IModule): Observable<IModule> {
    return this.http.post<IModule>(`${this.url}/modules`, module)
  }


  editModule(module: IModule): Observable<IModule> {
    return this.http.patch<IModule>(`${this.url}/modules`, module)
  }


  // submodulos

  getSubModulesAll(): Observable<Array<ISubModule>> {
    return this.http.get<Array<ISubModule>>(`${this.url}/subModules`)
  }

  newSubModule(subModule: ISubModule): Observable<ISubModule> {
    return this.http.post<ISubModule>(`${this.url}/subModules`, subModule)
  }


  editSubModule(subModule: ISubModule): Observable<ISubModule> {
    return this.http.patch<ISubModule>(`${this.url}/subModules`, subModule)
  }

    /**
   * metodo del servicio para cambiar el estado del BusinessAccount
   * @param id
   * @returns
   */
    public cambiarEstadosByid(id: number): Observable<Array<any>> {
      return this.http.get<Array<any>>(`${this.url}/subModules/estados/${id}`);
    }

}
