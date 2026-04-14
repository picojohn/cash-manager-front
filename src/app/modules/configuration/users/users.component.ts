import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { IPermisionValue } from 'src/app/shared/interface/permission.interface';
import { firstValueFrom } from 'rxjs';
import { PanelService } from '../panel/services/panel.service';
import { EditUserComponent } from './components/edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {

  private bsModalRef: BsModalRef;
  public users: Array<any> = [];
  public roles: Array<any> = [];
  public companies: Array<any> = [];
  public nPaginas = [5, 10, 20, 50, 100];
  public page: number = 1;
  public totalPaginas = 5;
  public _buscador: string = '';
  public permisionBoolean: IPermisionValue;

  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
    private sweetAlertService: SweetAlertService,
    private permissionService: PermissionService,
  ) {
    const pestanas = this.permissionService.getPermissions('users');
    if (pestanas && pestanas.permission) {
      this.permissionService.getPermisionValue(pestanas.permission);
    }
    this.permisionBoolean = this.permissionService.permisionBoolean;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    firstValueFrom(this.panelService.getAllUsers()).then(data => {
      this.users = data;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
    firstValueFrom(this.panelService.roles()).then(data => { this.roles = data; });
    firstValueFrom(this.panelService.getAllCompanies()).then(data => { this.companies = data; });
  }

  getRoleName(idRole) { return this.roles.find(r => r.id == idRole)?.name || ''; }
  getCompanyName(idCompany) { return this.companies.find(c => c.id == idCompany)?.name || ''; }

  newUser() {
    this.bsModalRef = this.modalService.show(EditUserComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = 'Crear Usuario';
    this.bsModalRef.content.roles = this.roles;
    this.bsModalRef.content.companies = this.companies;
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  editUser(user) {
    this.bsModalRef = this.modalService.show(EditUserComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = 'Editar Usuario';
    this.bsModalRef.content.user = user;
    this.bsModalRef.content.roles = this.roles;
    this.bsModalRef.content.companies = this.companies;
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  async statesUser(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.panelService.cambiarEstadosByidUser(id)).then(_ => {
        this.toast.success('Estado cambiado correctamente');
        this.loadData();
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      });
    }
  }

  numeroPaginas($event: any) { this.totalPaginas = $event.target.value; this.page = 1; }
  set buscador(value: string) { this._buscador = value; this.page = 1; }
  get buscador(): string { return this._buscador; }
  filterData() {
    if (!this.buscador) return this.users;
    return this.users.filter(u =>
      u.name.toLowerCase().includes(this.buscador.toLowerCase()) ||
      u.email.toLowerCase().includes(this.buscador.toLowerCase())
    );
  }
}
