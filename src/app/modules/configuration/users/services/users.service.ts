import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/users`);
  }

  newUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.url}/users`, user);
  }

  editUser(user: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/users`, user);
  }

  cambiarEstadosByidUser(id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.url}/users/estados/${id}`);
  }

  changePassword(data: { password: string; newPassword: string }): Observable<any> {
    return this.http.patch<any>(`${this.url}/users/change-password`, data);
  }
}
