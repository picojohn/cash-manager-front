import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMenuPermissions, IModule, IRole, ISubModule } from '../interface/panel.interface';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private url = environment.endpoint
  constructor(private http: HttpClient) { }

  // Módulos
  getAllModules(): Observable<Array<IModule>> {
    return this.http.get<Array<IModule>>(`${this.url}/modules`)
  }

  newModule(module: IModule): Observable<IModule> {
    return this.http.post<IModule>(`${this.url}/modules`, module)
  }

  editModule(module: IModule): Observable<IModule> {
    return this.http.patch<IModule>(`${this.url}/modules`, module)
  }

  // SubMódulos
  getAllSubModules(): Observable<Array<ISubModule>> {
    return this.http.get<Array<ISubModule>>(`${this.url}/subModules`)
  }

  newSubModule(subModule: ISubModule): Observable<ISubModule> {
    return this.http.post<ISubModule>(`${this.url}/subModules`, subModule)
  }

  editSubModule(subModule: ISubModule): Observable<ISubModule> {
    return this.http.patch<ISubModule>(`${this.url}/subModules`, subModule)
  }

  public cambiarEstadosByidSubModule(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/subModules/estados/${id}`);
  }

  // Roles
  public roles(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/roles`)
  }

  newRol(rol: IRole): Observable<IRole> {
    return this.http.post<IRole>(`${this.url}/roles`, rol);
  }

  editRol(rol: IRole): Observable<IRole> {
    return this.http.patch<IRole>(`${this.url}/roles`, rol);
  }

  public cambiarEstadosByidRole(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/roles/estados/${id}`);
  }

  // MenuPermissions
  public getAllMenuPermissions(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/menuPermissions`)
  }

  newMenuPermissions(data): Observable<any> {
    return this.http.post<any>(`${this.url}/menuPermissions`, data);
  }

  editMenuPermissions(data): Observable<any> {
    return this.http.patch<any>(`${this.url}/menuPermissions`, data);
  }

  // Companies
  public getAllCompanies(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/companies`)
  }

  newCompany(company): Observable<any> {
    return this.http.post<any>(`${this.url}/companies`, company);
  }

  editCompany(company): Observable<any> {
    return this.http.patch<any>(`${this.url}/companies`, company);
  }

  public cambiarEstadosByidCompany(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/companies/estados/${id}`);
  }

  // Users
  public getAllUsers(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/users`)
  }

  newUser(user): Observable<any> {
    return this.http.post<any>(`${this.url}/users`, user);
  }

  editUser(user): Observable<any> {
    return this.http.patch<any>(`${this.url}/users`, user);
  }

  public cambiarEstadosByidUser(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/users/estados/${id}`);
  }
}
