import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { IAuthentication, ILoginInfo } from '../interface/authentication';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ILoginInfo } from '../interface/authentication';
//import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {



  /** Url del servicio de authentocacion */
  private url = environment.endpoint
  constructor(private http: HttpClient) { }



   /**
    * Metodo de login
    * @param { ILoginInfo } payload;
    * @returns Observable<IAuthentication>
    */
   login(payload: ILoginInfo): Observable<any> {
   return this.http.post(`${this.url}/login/login`, payload)
   }

  //  generateCode(payload: ILoginInfo): Observable<any> {
  //  return this.http.post(`${this.url}/login/generate-code`, payload)
  //  }

  //  comprobateCode(payload: ILoginInfo): Observable<any> {
  //  return this.http.post(`${this.url}/login/comprobate-code`, payload)
  //  }


  //  updatePassUserName(payload: ILoginInfo): Observable<any> {
  //  return this.http.post(`${this.url}/login/change-email-pass`, payload)
  //  }


}
