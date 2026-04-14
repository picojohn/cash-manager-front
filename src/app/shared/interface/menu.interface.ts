export interface IMenuSidebar {
  isOpen: boolean;
  iconModule: string;
  idModule: number;
  nameModule: string;
  pathModule: string;
  children: Array<ISubMenuSidebar>;
}

export interface ISubMenuSidebar {
  iconSubModule: string;
  idSubModule: number;
  nameSubModule: string;
  pathSubModule: string;
}
