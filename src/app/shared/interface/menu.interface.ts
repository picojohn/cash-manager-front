
// export interface Menu {
//     path?: string;
//     title?: string;
//     icon?: string;
//     type?: string;
//     badgeType?: string;
//     badgeValue?: string;
//     active?: boolean;
//     bookmark?: boolean;
//     children?: Menu[];
// }

export interface IMenuSidebar {
  isOpen: boolean
  iconModule: string;
  idModule: number;
  nameModule: string
  pathModule: string
  subModules: Array<ISubMenuSidebar>
}
export interface ISubMenuSidebar {
  iconSubModule: string;
  idSubModule: number;
  nameSubModule: string;
  pathSubModule: string;
}
