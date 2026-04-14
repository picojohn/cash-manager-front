import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { IPermisionValue } from 'src/app/shared/interface/permission.interface';
import { firstValueFrom } from 'rxjs';
import { PanelService } from '../panel/services/panel.service';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit {

  private bsModalRef: BsModalRef;
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
    const pestanas = this.permissionService.getPermissions('companies');
    if (pestanas && pestanas.permission) {
      this.permissionService.getPermisionValue(pestanas.permission);
    }
    this.permisionBoolean = this.permissionService.permisionBoolean;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    firstValueFrom(this.panelService.getAllCompanies()).then(data => {
      this.companies = data;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }

  newCompany() {
    this.bsModalRef = this.modalService.show(EditCompanyComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = 'Crear Empresa';
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  editCompany(company) {
    this.bsModalRef = this.modalService.show(EditCompanyComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    this.bsModalRef.content.title = 'Editar Empresa';
    this.bsModalRef.content.company = company;
    this.bsModalRef.onHidden?.subscribe((_) => { this.loadData(); });
  }

  async statesCompany(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.panelService.cambiarEstadosByidCompany(id)).then(_ => {
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
    if (!this.buscador) return this.companies;
    return this.companies.filter(c => c.name.toLowerCase().includes(this.buscador.toLowerCase()));
  }
}
