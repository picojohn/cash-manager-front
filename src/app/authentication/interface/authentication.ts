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
  email?: string;
  id?: number;
  personId?: number;
  newPassword?: string;
}

export interface IDatosUsuario {
  id: number
  name: string;
  lastName: string;
  userName: string;
  mobile: number;
  email: string;
  idCompany: number
}


