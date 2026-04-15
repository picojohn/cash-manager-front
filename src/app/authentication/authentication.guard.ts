import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(public router: Router) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/authentication/login']);
      return false;
    }

    // Validar si el token está vencido
    try {
      const decoded: any = jwt_decode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        localStorage.clear();
        this.router.navigate(['/authentication/login']);
        return false;
      }
    } catch {
      localStorage.clear();
      this.router.navigate(['/authentication/login']);
      return false;
    }

    return true;
  }
}
