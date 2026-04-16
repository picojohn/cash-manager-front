import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { IMenuPermissions, IModule, IRole, ISubModule } from './interface/panel.interface';
import { PanelService } from './services/panel.service';
import { EditModuleComponent } from './components/edit-module/edit-module.component';
import { EditSubModuleComponent } from './components/edit-subModule/edit-subModule.component';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { EditMenuPermissionsComponent } from './components/edit-menu-permissions/edit-menu-permissions.component';
import { IPermisionValue, IPermissionAction } from 'src/app/shared/interface/permission.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent implements OnInit {

  public selectedTab: string = 'modules';
  private bsModalRef: BsModalRef;

  // Módulos
  public modules: Array<IModule> = [];
  public nPaginasModule = [5, 10, 20, 50, 100];
  public pageModule: number = 1;
  public totalPaginasModule = 5;
  public _buscadorModule: string = '';

  // SubMódulos
  public subModules: Array<ISubModule> = [];
  public nPaginasSubModule = [5, 10, 20, 50, 100];
  public pageSubModule: number = 1;
  public totalPaginasSubModule = 5;
  public _buscadorSubModule: string = '';

  // Roles
  public roles: Array<IRole> = [];
  public menuPermissions: Array<any> = [];
  public nPaginasRole = [5, 10, 20, 50, 100];
  public pageRole: number = 1;
  public totalPaginasRole = 5;
  public _buscadorRole: string = '';

  // Permisos
  public permisionBoolean: IPermisionValue;
  public rolesUser: IRole;

  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
    private sweetAlertService: SweetAlertService,
    private permissionService: PermissionService,
    private translateService: TranslateService,
  ) {
    const pestanas = this.permissionService.getPermissions('panel');
    if (pestanas && pestanas.permission) {
      this.permissionService.getPermisionValue(pestanas.permission);
    }
    this.permisionBoolean = this.permissionService.permisionBoolean;
  }

  ngOnInit(): void {
    this.rolesUser = JSON.parse(localStorage.getItem('role'));
    this.loadData();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

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

    firstValueFrom(this.panelService.roles()).then(rolesBack => {
      this.roles = rolesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.panelService.getAllMenuPermissions()).then(data => {
      const grouped = Object.values(data.reduce((acc, item) => {
        const { idRole, id, ...options } = item;
        if (!acc[idRole]) {
          acc[idRole] = { idRole, options: [] };
        }
        acc[idRole].options.push(options);
        return acc;
      }, {}));
      this.menuPermissions = grouped;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }

  // ===== MODULES =====
  newModule() {
    this.bsModalRef = this.modalService.show(EditModuleComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = this.translateService.instant('PANEL.MODULES.CREATE_MODULE');
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  editModule(module: IModule) {
    this.bsModalRef = this.modalService.show(EditModuleComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = this.translateService.instant('PANEL.MODULES.EDIT_MODULE');
    this.bsModalRef.content.module = module;
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  numeroPaginasModule($event: any) { this.totalPaginasModule = $event.target.value; this.pageModule = 1; }
  set buscadorModule(value: string) { this._buscadorModule = value; this.pageModule = 1; }
  get buscadorModule(): string { return this._buscadorModule; }
  filterModules() {
    if (!this.buscadorModule) return this.modules;
    return this.modules.filter(m => m.name.toLowerCase().includes(this.buscadorModule.toLowerCase()));
  }

  // ===== SUBMODULES =====
  newSubModule() {
    this.bsModalRef = this.modalService.show(EditSubModuleComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = this.translateService.instant('PANEL.SUBMODULES.CREATE_SUBMODULE');
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  editSubModule(subModule: ISubModule) {
    this.bsModalRef = this.modalService.show(EditSubModuleComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = this.translateService.instant('PANEL.SUBMODULES.EDIT_SUBMODULE');
    this.bsModalRef.content.subModule = subModule;
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  async statesSubModule(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.panelService.cambiarEstadosByidSubModule(id)).then(_ => {
        this.toast.success(this.translateService.instant('PANEL.ROLES.STATUS_CHANGED'), ETitleMessages.SUBMODULE);
        this.loadData();
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      });
    }
  }

  getModulesId(idModule) {
    return this.modules.find(i => i.id == idModule)?.name || '';
  }

  numeroPaginasSubModule($event: any) { this.totalPaginasSubModule = $event.target.value; this.pageSubModule = 1; }
  set buscadorSubModule(value: string) { this._buscadorSubModule = value; this.pageSubModule = 1; }
  get buscadorSubModule(): string { return this._buscadorSubModule; }
  filterSubModules() {
    if (!this.buscadorSubModule) return this.subModules;
    return this.subModules.filter(s => s.name.toLowerCase().includes(this.buscadorSubModule.toLowerCase()));
  }

  // ===== ROLES =====
  newRole() {
    this.bsModalRef = this.modalService.show(EditRoleComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = this.translateService.instant('PANEL.ROLES.CREATE_ROLE');
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  editRole(role: IRole) {
    this.bsModalRef = this.modalService.show(EditRoleComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = this.translateService.instant('PANEL.ROLES.EDIT_ROLE');
    this.bsModalRef.content.role = role;
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  editMenuPermissions(role: IRole) {
    let menuPermission = this.menuPermissions.find(i => i.idRole == role.id);
    this.bsModalRef = this.modalService.show(EditMenuPermissionsComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = this.translateService.instant('PANEL.PERMISSIONS.EDIT_MENU_PERMISSIONS');
    this.bsModalRef.content.menuPermission = menuPermission;
    this.bsModalRef.content.role = role;
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  async statesRole(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.panelService.cambiarEstadosByidRole(id)).then(_ => {
        this.toast.success(this.translateService.instant('PANEL.ROLES.STATUS_CHANGED'), ETitleMessages.ROLES);
        this.loadData();
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      });
    }
  }

  numeroPaginasRole($event: any) { this.totalPaginasRole = $event.target.value; this.pageRole = 1; }
  set buscadorRole(value: string) { this._buscadorRole = value; this.pageRole = 1; }
  get buscadorRole(): string { return this._buscadorRole; }
  filterRoles() {
    if (!this.buscadorRole) return this.roles;
    return this.roles.filter(r => r.name.toLowerCase().includes(this.buscadorRole.toLowerCase()));
  }
}
