export interface IModule {
  id: number;
  name: string;
  path: string;
  icon : string;

}


export interface ISubModule{
  id: number;
  name: string;
  path: string;
  idModule: number;
  icon: string;
  state: number;
 }





 