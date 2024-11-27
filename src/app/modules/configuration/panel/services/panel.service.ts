import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApplicationTab, IMenuPermissions, IModule, IRole, ISubModule } from '../interface/panel.interface';



@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private url = environment.endpoint
  constructor(private http: HttpClient) { }

  //  moduelos
  getAllModules(): Observable<Array<IModule>> {
    return this.http.get<Array<IModule>>(`${this.url}/modules`)
  }

  newModule(module: IModule): Observable<IModule> {
    return this.http.post<IModule>(`${this.url}/modules`, module)
  }


  editModule(module: IModule): Observable<IModule> {
    return this.http.patch<IModule>(`${this.url}/modules`, module)
  }


  // submodulos

  getAllSubModules(): Observable<Array<ISubModule>> {
    return this.http.get<Array<ISubModule>>(`${this.url}/subModules`)
  }

  newSubModule(subModule: ISubModule): Observable<ISubModule> {
    return this.http.post<ISubModule>(`${this.url}/subModules`, subModule)
  }


  editSubModule(subModule: ISubModule): Observable<ISubModule> {
    return this.http.patch<ISubModule>(`${this.url}/subModules`, subModule)
  }

  /**
 * metodo del servicio para cambiar el estado del submoduele
 * @param id
 * @returns
 */
  public cambiarEstadosByidSubModule(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/subModules/estados/${id}`);
  }



  // ApplicationTab

  getAllApplicationTabs(): Observable<Array<any>> {
    return this.http.get<Array<IApplicationTab>>(`${this.url}/applicationTabs`)
  }

  newApplicationTab(applicationTab: IApplicationTab): Observable<IApplicationTab> {
    return this.http.post<IApplicationTab>(`${this.url}/applicationTabs`, applicationTab)
  }


  editApplicationTab(applicationTab: IApplicationTab): Observable<IApplicationTab> {
    return this.http.patch<IApplicationTab>(`${this.url}/applicationTabs`, applicationTab)
  }

  /**
 * metodo del servicio para cambiar el estado del BusinessAccount
 * @param id
 * @returns
 */
  public cambiarEstadosByidApplicationTab(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/applicationTabs/estados/${id}`);
  }


  ///// roles

  // Roles
  public roles(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/roles`)
  }

  /**
   * metodo del servicio de Roles para crear una Rol
   * @param rol
   * @returns IRol
  */
  newRol(rol: IRole): Observable<IRole> {
    return this.http.post<IRole>(`${this.url}/roles`, rol);
  }

  /**
   * metodo del servicio de Roles para editar un Rol
   * @param rol
   * @returns IRol
  */
  editRol(rol: IRole): Observable<IRole> {
    return this.http.patch<IRole>(`${this.url}/roles`, rol);
  }

  public cambiarEstadosByidRole(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/roles/estados/${id}`);
  }




  // menuPermissions
  public getAllMenuPermissions(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/menuPermissions`)
  }

  /**
   * metodo del servicio de Roles para crear una Rol
   * @param rol
   * @returns IRol
  */
  newMenuPermissions(data): Observable<any> {
    return this.http.post<any>(`${this.url}/menuPermissions`, data);
  }

  /**
   * metodo del servicio de Roles para editar un Rol
   * @param rol
   * @returns IRol
  */
  editMenuPermissions(data): Observable<any> {
    return this.http.patch<any>(`${this.url}/menuPermissions`, data);
  }
}
