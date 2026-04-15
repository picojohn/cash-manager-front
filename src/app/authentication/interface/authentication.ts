export interface IMenu {
  idModule: number;
  nameModule: string;
  pathModule: string;
  iconModule: string;
  children: Array<IMenuChildren>
}

export interface IMenuChildren {
  idSubModule: number;
  nameSubModule: string;
  pathSubModule: string;
  iconSubModule: string;
  actions: string;
}

export interface ILoginInfo {
  email?: string;
  password?: string;
  newPassword?: string;
}

export interface IDatosUsuario {
  id: number;
  name: string;
  email: string;
  phone: string;
  idCompany: number;
  companyName: string;
}
