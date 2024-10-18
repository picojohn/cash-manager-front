// import { Injectable } from '@angular/core';
// import { IPermisionValue, IPermissionAction } from "../interface/permission.interface";
// @Injectable({
//   providedIn: 'root'
// })
// export class PermissionService {

//   /** Permisos sobre la pantalla */
//   public permission: IPermissionAction;
//   public permisionBoolean: IPermisionValue;
//   constructor(
//   ) {
//     this.permisionBoolean = {
//       DELETE: false,
//       INSERT: false,
//       READ: true,
//       UPDATE: false,
//     }
//   }



//   /**
//    * Metodo que llama a funcion obtiene los permisions del store
//    * @param {string}windowModule
//    * @returns Promise<void>
//    */
//   public getPermissions(windowModule: string): void {
//     let permission = []
//     permission = JSON.parse(localStorage.getItem('permission'))
//     this.permission = permission.find(item => item.window === windowModule);
//        this.getPermisionValue(this.permission);
//   }


//   /**
//    * Metodo que obtiene los valores booleanos de los permisos
//    * @param {IPermissionAction} permission
//    * @returns void
//    */
//   public getPermisionValue(permission: IPermissionAction): void {
//     permission.permision.forEach(item => {
//       switch (item['action']) {
//         case 'INSERT':
//           this.permisionBoolean.INSERT = item.status;
//           break;
//         case 'UPDATE':
//           this.permisionBoolean.UPDATE = item.status;
//           break;
//         case 'DELETE':
//           this.permisionBoolean.DELETE = item.status;
//           break;
//       }
//     })
//   }
// }
