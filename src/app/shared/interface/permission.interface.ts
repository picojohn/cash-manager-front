export interface IPermissionAction {
  permision: Array<IActionPermision>;
  window: string;
}

interface IActionPermision {
  action: string;
  codeAction: string;
  status: boolean;
}

export interface IPermisionValue {
  READ: boolean;
  UPDATE: boolean;
  DELETE: boolean;
  INSERT: boolean;
}
