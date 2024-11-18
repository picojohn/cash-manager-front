import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { IApplicationTab, IModule, IRole, ISubModule } from './interface/panel.interface';
import { PanelService } from './services/panel.service';
import { EditModuleComponent } from './components/edit-module/edit-module.component';
import { EditSubModuleComponent } from './components/edit-subModule/edit-subModule.component';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { EditApplicationTabComponent } from './components/edit-applicationTab/edit-applicationTab.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { EditMenuPermissionsComponent } from './components/edit-menu-permissions/edit-menu-permissions.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent implements OnInit {

  public selectedTab: number = 4;
  private bsModalRef: BsModalRef;

  //  pestaña de modulos
  public modules: Array<IModule> = [];
  public nPaginasModule = [5, 10, 20, 50, 100];
  public pageModule: number = 1;
  public totalPaginasModule = 5;
  public _buscadorModule: string = '';

  //  pestaña de subModulos
  public subModules: Array<ISubModule> = [];
  public nPaginasSubModule = [5, 10, 20, 50, 100];
  public pageSubModule: number = 1;
  public totalPaginasSubModule = 5;
  public _buscadorSubModule: string = '';

  //  pestaña de ApplicationTab
  public applicationTabs: Array<IApplicationTab> = [];
  public nPaginasApplicationTab = [5, 10, 20, 50, 100];
  public pageApplicationTab: number = 1;
  public totalPaginasApplicationTab = 5;
  public _buscadorApplicationTab: string = '';


  // pestaña de roles menu permisos
  public roles: Array<IRole> = []
  public nPaginasRole = [5, 10, 20, 50, 100];
  public pageRole: number = 1;
  public totalPaginasRole = 5;
  public _buscadorRole: string = '';


  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
    private sweetAlertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  selectTab(tabNumber: number) {
    this.selectedTab = tabNumber;
  }

  /**
   * carga inicial de datos
   */
  loadData() {
    firstValueFrom(this.panelService.getAllModules()).then(modulesBack => {
      this.modules = modulesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.panelService.getAllSubModules()).then(subModulesBack => {
      this.subModules = subModulesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.panelService.getAllApplicationTabs()).then(applicationTabsBack => {
      this.applicationTabs = applicationTabsBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
    firstValueFrom(this.panelService.roles()).then(rolesBack => {
      console.log(rolesBack);

      this.roles = rolesBack
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })
  }


  // para la pestaña de modulos
  newModule() {
    this.bsModalRef = this.modalService.show(EditModuleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Modulo';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editModule(module: IModule) {
    this.bsModalRef = this.modalService.show(EditModuleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Modulo';
    this.bsModalRef.content.module = module;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  numeroPaginasModule($event: any) {
    const { value } = $event.target;
    this.totalPaginasModule = value;
    this.pageModule = 1;
  }


  set buscadorModule(value: string) {
    this._buscadorModule = value;
    this.pageModule = 1;
  }

  get buscadorModule(): string {
    return this._buscadorModule;
  }



  filterModules() {
    if (!this.buscadorModule) {
      return this.modules;
    }
    return this.modules.filter((currency) =>
      currency.name.toLowerCase().includes(this.buscadorModule.toLowerCase())
    );
  }



  // para la pestaña de sub-modulos

  newSubModule() {
    this.bsModalRef = this.modalService.show(EditSubModuleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear SubModulo';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editSubModule(subModule: IModule) {
    this.bsModalRef = this.modalService.show(EditSubModuleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar SubModulo';
    this.bsModalRef.content.subModule = subModule;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo del controlador de colaborador para cambiar el estdo de un colaborador
   * @param id
   */
  async statesSubModule(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.panelService.cambiarEstadosByidSubModule(id)).then(
        (_) => {
          this.toast.success('Estado cambiado correctamente', ETitleMessages.SUBMODULE);
          this.loadData();
        },
        (err) => {
          const errorObject = this.errorService.showNotification(err);
          this.toast[errorObject.typeToast](
            errorObject.message,
            errorObject.typeMessage,
            { timeOut: errorObject.timeOut }
          );
        }
      );
    }
  }

  getModulesId(idModule) {
    const modules = this.modules.find(i => i.id == idModule)?.name
    return modules ? modules : ''
  }

  numeroPaginasSubModule($event: any) {
    const { value } = $event.target;
    this.totalPaginasSubModule = value;
    this.pageSubModule = 1;
  }

  set buscadorSubModule(value: string) {
    this._buscadorSubModule = value;
    this.pageSubModule = 1;
  }

  get buscadorSubModule(): string {
    return this._buscadorSubModule;
  }

  filterSubModules() {
    if (!this.buscadorSubModule) {
      return this.subModules;
    }
    return this.subModules.filter((currency) =>
      currency.name.toLowerCase().includes(this.buscadorSubModule.toLowerCase())
    );
  }


  ///// ApplicationTab

  newApplicationTab() {
    this.bsModalRef = this.modalService.show(EditApplicationTabComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Pestaña';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editApplicationTab(applicationTab: IApplicationTab) {
    this.bsModalRef = this.modalService.show(EditApplicationTabComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Pestaña';
    this.bsModalRef.content.applicationTab = applicationTab;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo del controlador de colaborador para cambiar el estdo de un colaborador
   * @param id
   */
  async statesApplicationTab(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.panelService.cambiarEstadosByidApplicationTab(id)).then(_ => {
        this.toast.success('Estado cambiado correctamente', ETitleMessages.APPLICATIONTAB);
        this.loadData();
      },
        (err) => {
          const errorObject = this.errorService.showNotification(err);
          this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
        }
      );
    }
  }

  getSubModulesId(idSubModule) {
    const subModules = this.subModules.find(i => i.id == idSubModule)?.name
    return subModules ? subModules : ''
  }

  numeroPaginasApplicationTab($event: any) {
    const { value } = $event.target;
    this.totalPaginasApplicationTab = value;
    this.pageApplicationTab = 1;
  }

  set buscadorApplicationTab(value: string) {
    this._buscadorApplicationTab = value;
    this.pageApplicationTab = 1;
  }

  get buscadorApplicationTab(): string {
    return this._buscadorApplicationTab;
  }

  filterApplicationTabs() {
    if (!this.buscadorApplicationTab) {
      return this.applicationTabs;
    }
    return this.applicationTabs.filter((ap) =>
      ap.name.toLowerCase().includes(this.buscadorApplicationTab.toLowerCase())
    );
  }

  ///// Role

  newRole() {
    this.bsModalRef = this.modalService.show(EditRoleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Rol';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editRole(role: IRole) {
    this.bsModalRef = this.modalService.show(EditRoleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Rol';
    this.bsModalRef.content.role = role;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editMenuPermissions(role: IRole) {
    // let menuPermiso: IMenuPermiso = this.menuPermisos.find(i => i.idRole == role.id)
    this.bsModalRef = this.modalService.show(EditMenuPermissionsComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = 'Editar Menú Permisos';
    // this.bsModalRef.content.menuPermiso = menuPermiso;
    this.bsModalRef.content.role = role;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo del controlador de colaborador para cambiar el estdo de un colaborador
   * @param id
   */
  async statesRole(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.panelService.cambiarEstadosByidRole(id)).then(
        (_) => {
          this.toast.success('Estado cambiado correctamente', ETitleMessages.ROLES);
          this.loadData();
        },
        (err) => {
          const errorObject = this.errorService.showNotification(err);
          this.toast[errorObject.typeToast](
            errorObject.message,
            errorObject.typeMessage,
            { timeOut: errorObject.timeOut }
          );
        }
      );
    }
  }

  numeroPaginasRole($event: any) {
    const { value } = $event.target;
    this.totalPaginasRole = value;
    this.pageRole = 1;
  }

  set buscadorRole(value: string) {
    this._buscadorRole = value;
    this.pageRole = 1;
  }

  get buscadorRole(): string {
    return this._buscadorRole;
  }

  filterRoles() {
    if (!this.buscadorRole) {
      return this.roles;
    }
    return this.roles.filter((role) =>
      role.name.toLowerCase().includes(this.buscadorRole.toLowerCase())
    );
  }






}
