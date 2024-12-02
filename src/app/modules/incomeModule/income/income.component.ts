import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { IPermisionValue, IPermissionAction, ITabsPermision } from 'src/app/shared/interface/permission.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { IRole } from '../../configuration/panel/interface/panel.interface';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent implements OnInit {

  public selectedTab: number ;
  private bsModalRef: BsModalRef;

   //permisos
   public permission: IPermissionAction;
   public permisionBoolean: IPermisionValue;
   public rolesUser: IRole;
   public pestanas: IPermissionAction;
   public selectedTabItem: ITabsPermision

  //  pestaña de facturacion / billing
  public billings: Array<any> = [];
  public nPaginasBilling = [5, 10, 20, 50, 100];
  public pageBilling: number = 1;
  public totalPaginasBilling = 5;
  public _buscadorBilling: string = '';





  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    // private panelService: PanelService,
    private sweetAlertService: SweetAlertService,
    private permissionService: PermissionService,
  ) {
    this.pestanas = this.permissionService.getPermissions('income');
    this.selectTab(this.pestanas.applicationTabs[0].idApplicationTab, this.pestanas.applicationTabs[0])

    this.permisionBoolean = this.permissionService.permisionBoolean;
  }

  ngOnInit(): void {
    this.rolesUser = JSON.parse(localStorage.getItem('role'))
    this.loadData();
  }

  selectTab(tabNumber: number, item) {
    this.selectedTab = tabNumber;
    this.selectedTabItem = item;
    this.permissionService.getPermisionValue(this.selectedTabItem.permission)
  }

  /**
   * carga inicial de datos
   */
  loadData() {
    // firstValueFrom(this.panelService.getAllModules()).then(modulesBack => {
    //   this.modules = modulesBack;
    // }, err => {
    //   const errorObject = this.errorService.showNotification(err);
    //   this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    // });

 }


  // para la pestaña de facturacion / Billing
  newBilling() {
    // this.bsModalRef = this.modalService.show(EditModuleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    // this.bsModalRef.content.title = 'Crear Modulo';
    // this.bsModalRef.onHidden?.subscribe((_) => {
    //   this.loadData();
    // });
  }

  editBilling(billing) {
    // this.bsModalRef = this.modalService.show(EditModuleComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    // this.bsModalRef.content.title = 'Editar Factura';
    // this.bsModalRef.content.billing = billing;
    // this.bsModalRef.onHidden?.subscribe((_) => {
    //   this.loadData();
    // });
  }

  numeroPaginasBilling($event: any) {
    const { value } = $event.target;
    this.totalPaginasBilling = value;
    this.pageBilling = 1;
  }


  set buscadorBilling(value: string) {
    this._buscadorBilling = value;
    this.pageBilling = 1;
  }

  get buscadorBilling(): string {
    return this._buscadorBilling;
  }



  filterBillings() {
    if (!this.buscadorBilling) {
      return this.billings;
    }
    return this.billings.filter((billing) =>
      billing.name.toLowerCase().includes(this.buscadorBilling.toLowerCase())
    );
  }









}
