export interface IModule {
  id: number;
  name: string;
  path: string;
  icon: string;

}


export interface ISubModule {
  id: number;
  name: string;
  path: string;
  idModule: number;
  icon: string;
  state: number;
}

export interface IApplicationTab {
  id: number;
  name: string;
  idModule: number;
  idSubModule: number;
  icon: string;
  state: number;
}

export interface IRole {
  id: number;
  name: string;
  state: number
}


export interface IMenuPermissions {
  id?: number;
  idModule: number;
  idSubModule: number;
  idApplicationTab: number;
  idRole: number;
  actions: string;
}

export interface IMenuModuleFormArray {
  idModule: number;
  nameModule: string;
  iconModule: string;
  subModules: Array<IMenuSubmoduleFormArray>;
}

export interface IMenuSubmoduleFormArray {
  idSubModule: number;
  nameSubModule: string;
  iconSubModule: string;
  applicationTabs: Array<IMenuApplicationTabFormArray>;
}

export interface IMenuApplicationTabFormArray {
  id: number;
  name: string;
  icon: string;
  state: number;
  mostrarAdicionales: boolean;
  actions: Array<IMenuActionFormArray>;
}

export interface IMenuActionFormArray {
  name: string;
  action: string
  codeAction: string;
  status: boolean
}



