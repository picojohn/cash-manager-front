//import { Menu } from "src/app/shared/interface/menu.interface";

// export interface IAuthentication {
//   id: number;
//   userName: string;
//   nombre: string;
//   correo: string;
//   direccion: string;
//   menu: Array<any> ;
//   role: Irole;
//   telephone: number;
//   token: string;
// }

export interface IMenu {
  id: number;
  idModule: number;
  name: string;
  path: string;
  status: number;
  icon: string;
  actions: string;
  children: Array<IMenuChildren>
}

export interface IMenuChildren {
  id: number;
  idModule: number;
  name: string;
  path: string;
  status: number;
  icon: string;
  actions: string;
}

export interface ILoginInfo {
  userName?: string;
  password?: string;
  email? : string;
  id?: number;
  personId?: number;
  newPassword?: string;
}

export interface IDatosUsuario {
  name: string;
  lastName: string;
  userName: string;
  id: number
  idCompany: number
}


