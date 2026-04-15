import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private datosUsuario$ = new BehaviorSubject<IDatosUsuario>(
    JSON.parse(localStorage.getItem('datosUsuario'))
  );

  get usuario$() {
    return this.datosUsuario$.asObservable();
  }

  get usuarioActual(): IDatosUsuario {
    return this.datosUsuario$.value;
  }

  setUsuario(datos: IDatosUsuario) {
    localStorage.setItem('datosUsuario', JSON.stringify(datos));
    this.datosUsuario$.next(datos);
  }

  /**
   * Actualiza parcialmente los datos del usuario
   */
  updateUsuario(datos: Partial<IDatosUsuario>) {
    const current = this.datosUsuario$.value;
    const updated = { ...current, ...datos };
    this.setUsuario(updated);
  }
}
