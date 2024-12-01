export interface IPermissionAction {
  applicationTabs: Array<ITabsPermision>;
  iconSubModule: string;
  idSubModule: number;
  nameSubModule: string;
  pathSubModule: string;
  // permision: Array<IActionPermision>;
  // window: string;
}

export interface ITabsPermision {
  iconApplicationTab: string;
  idApplicationTab: number;
  nameApplicationTab: string
  permission: Array<IActionPermision>
}

export interface IActionPermision {
  action: string;
  codeAction: string;
  status: boolean;
}

export interface IPermisionValue {
  READ: boolean;
  UPDATE: boolean;
  DELETE: boolean;
  STATUS: boolean;
  INSERT: boolean;
}


