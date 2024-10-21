import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICustomError } from "../interface/error.service.interface";
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private messageObject: ICustomError;
  private timeOut = 10000;
  constructor() {
    this.messageObject = {
      errorCode: '1000',
      message: 'Error desconocido, comunicate con el administrador',
      status: 1000,
      typeMessage: 'Desconocido',
      timeOut: this.timeOut,
      typeToast: 'error'
    };
  }

  /**
   * Metodo para el manejo del error y mostrar la respectiva notificacion
   * @param {HttpErrorResponse} error
   * @returns {ICustomError}
   */
  public showNotification(error: HttpErrorResponse): ICustomError {

    const customError: ICustomError = error.error;

    if (customError && customError['statusCode'] == 403 && customError.message == 'Token error: Token error: jwt expired') {
      customError.typeMessage = 'Token expirado';
      customError.timeOut = 100000;
      customError.typeToast = 'info';
      customError.message = 'Token expirado, por favor cierra sesion y vuelve a iniciar'
      this.messageObject = customError;

    }

    switch (error.status) {
      case 400:
        customError.typeMessage = 'Error';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'error';
        this.messageObject = customError;
        break;
    }

    switch (customError && customError.errorCode) {


      case '3001':
        customError.typeMessage = 'Login';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3002': // comienzo de errores
        customError.typeMessage = 'Login';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3003':
        customError.typeMessage = 'Login';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3004':
        customError.typeMessage = 'Login';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3005':
        customError.typeMessage = 'Login';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3006':
        customError.typeMessage = 'Contratos';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3007':
        customError.typeMessage = 'Afiliados';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3008':
        customError.typeMessage = 'Cuentas Comerciales';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3009':
        customError.typeMessage = 'Grupos Empresariales';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3010':
        customError.typeMessage = 'Clientes';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3011':
        customError.typeMessage = 'Productos';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3012':
        customError.typeMessage = 'Lineas';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3013':
        customError.typeMessage = 'Lineas';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3014':
        customError.typeMessage = 'Sector';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3015':
        customError.typeMessage = 'SubSector';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3016':
        customError.typeMessage = 'Sistemas';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3017':
        customError.typeMessage = 'Productos';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3018':// va esta
        customError.typeMessage = 'Tarifas';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3019':// va esta
        customError.typeMessage = 'Tarifas';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;
      case '3020':// va esta
        customError.typeMessage = 'Tarifas';
        customError.timeOut = this.timeOut;
        customError.typeToast = 'info';
        this.messageObject = customError;
        break;


    }
    return this.messageObject;
  }
}

