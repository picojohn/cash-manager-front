export interface IPermissionAction {
  iconSubModule: string;
  idSubModule: number;
  nameSubModule: string;
  pathSubModule: string;
  permission: Array<IActionPermision>;
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
