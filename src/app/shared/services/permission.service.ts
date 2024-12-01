import { Injectable } from '@angular/core';
import { IActionPermision, IPermisionValue, IPermissionAction } from "../interface/permission.interface";
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  /** Permisos sobre la pantalla */
  public permission: IPermissionAction;
  public permisionBoolean: IPermisionValue;
  constructor(
  ) {
    this.permisionBoolean = {
      READ: true,
      INSERT: false,
      UPDATE: false,
      DELETE: false,
      STATUS: false,
    }
  }

  /**
   * Metodo que llama a funcion obtiene los permisions del store
   * @param {string}windowModule
   * @returns Promise<void>
   */
  public getPermissions(windowModule: string) {
    let permission = []
    permission = JSON.parse(localStorage.getItem('permission'))
    this.permission = permission.find(item => item.pathSubModule === windowModule);
    return this.permission
  }

  /**
   * Metodo que obtiene los valores booleanos de los permisos
   * @param {IPermissionAction} permission
   * @returns void
   */
  public getPermisionValue(permission: Array<IActionPermision>): void {
    permission.forEach(item => {
      switch (item['action']) {
        case 'INSERT':
          this.permisionBoolean.INSERT = item.status;
          break;
        case 'UPDATE':
          this.permisionBoolean.UPDATE = item.status;
          break;
        case 'DELETE':
          this.permisionBoolean.DELETE = item.status;
          break;
        case 'STATUS':
          this.permisionBoolean.STATUS = item.status;
          break;
      }
    })
  }


}
