import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { QuickbooksService } from '../services/quickbooks.service';
import { IQbCustomer } from '../interface/quickbooks.interface';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';

type FilterStatus = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-qb-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  public customers: Array<IQbCustomer> = [];
  public loading: boolean = false;
  public syncing: boolean = false;

  public filterStatus: FilterStatus = 'all';
  public statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 10;
  public page: number = 1;
  public _buscador: string = '';

  private bsModalRef: BsModalRef;

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private sweetAlertService: SweetAlertService,
    private quickbooksService: QuickbooksService,
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  async loadCustomers(): Promise<void> {
    // Solo mostrar spinner en la carga inicial; en refresh mantenemos la tabla
    // visible y reemplazamos los datos al final para evitar parpadeo.
    const isInitialLoad = this.customers.length === 0;
    if (isInitialLoad) this.loading = true;
    try {
      const res = await firstValueFrom(this.quickbooksService.getCustomers(0, 1000));
      this.customers = (res.items || []).sort((a, b) => (b.id || 0) - (a.id || 0));
    } catch (err) {
      this.handleError(err);
    } finally {
      if (isInitialLoad) this.loading = false;
    }
  }

  async syncNow(): Promise<void> {
    if (this.syncing) return;
    this.syncing = true;
    try {
      const result = await firstValueFrom(this.quickbooksService.syncCustomers());
      this.toast.success(
        `Sync OK: ${result.recordsCreated} nuevos, ${result.recordsUpdated} actualizados`,
      );
      await this.loadCustomers();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  newCustomer(): void {
    this.bsModalRef = this.modalService.show(EditCustomerComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = 'Crear customer';
    this.bsModalRef.content.customer = null;
    this.bsModalRef.onHidden?.subscribe(() => this.loadCustomers());
  }

  editCustomer(customer: IQbCustomer): void {
    this.bsModalRef = this.modalService.show(EditCustomerComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = 'Editar customer';
    this.bsModalRef.content.customer = customer;
    this.bsModalRef.onHidden?.subscribe(() => this.loadCustomers());
  }

  async toggleActive(customer: IQbCustomer): Promise<void> {
    const willActivate = customer.active !== 1;
    const action = willActivate ? 'activar' : 'desactivar';

    // Guard preventivo: QB no deja desactivar customers con balance != 0.
    // Lo validamos aca para evitar el roundtrip a QB y dar feedback inmediato.
    if (!willActivate && Math.abs(Number(customer.balance) || 0) > 0.001) {
      this.toast.warning(
        `No se puede desactivar este customer porque tiene un balance pendiente de $${Number(customer.balance).toFixed(2)}. Cierra o cancela las facturas/pagos pendientes en QuickBooks primero.`,
        'QuickBooks',
        { timeOut: 10000 },
      );
      return;
    }

    const confirmed = await this.sweetAlertService.alertStatesMessage();
    if (!confirmed) return;

    try {
      await firstValueFrom(
        this.quickbooksService.setCustomerActive(customer.qbId, willActivate),
      );
      this.toast.success(`Customer ${action}do en QuickBooks`);
      await this.loadCustomers();
    } catch (err) {
      this.handleError(err);
    }
  }

  filterData(): Array<IQbCustomer> {
    let list = this.customers;
    if (this.filterStatus === 'active') {
      list = list.filter((c) => c.active === 1);
    } else if (this.filterStatus === 'inactive') {
      list = list.filter((c) => c.active !== 1);
    }
    if (this._buscador) {
      const q = this._buscador.toLowerCase();
      list = list.filter(
        (c) =>
          c.displayName?.toLowerCase().includes(q) ||
          c.companyName?.toLowerCase().includes(q) ||
          c.primaryEmail?.toLowerCase().includes(q) ||
          c.qbId?.toLowerCase().includes(q),
      );
    }
    return list;
  }

  onFilterStatusChange(): void {
    this.page = 1;
  }

  numeroPaginas($event: any) {
    this.totalPaginas = parseInt($event.target.value, 10);
    this.page = 1;
  }

  set buscador(value: string) {
    this._buscador = value;
    this.page = 1;
  }
  get buscador(): string {
    return this._buscador;
  }

  private handleError(err: any): void {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
  }
}
