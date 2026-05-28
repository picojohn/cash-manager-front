import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { CustomersService } from './services/customers.service';
import { IQbCustomer } from './interface/customer.interface';
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
  public loadError: string | null = null;
  public syncing: boolean = false;

  public filterStatus: FilterStatus = 'all';
  public statusOptions: Array<{ value: FilterStatus; label: string }> = [];

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 10;
  public page: number = 1;
  public _buscador: string = '';

  private bsModalRef: BsModalRef;

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private sweetAlertService: SweetAlertService,
    private customersService: CustomersService,
    private modalService: BsModalService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buildStatusOptions();
    this.translate.onLangChange.subscribe(() => this.buildStatusOptions());
    this.loadCustomers();
  }

  private buildStatusOptions(): void {
    this.statusOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'active', label: this.translate.instant('QUICKBOOKS.FILTER_ACTIVE') },
      { value: 'inactive', label: this.translate.instant('QUICKBOOKS.FILTER_INACTIVE') },
    ];
  }

  async loadCustomers(): Promise<void> {
    // Solo mostrar spinner en la carga inicial; en refresh mantenemos la tabla
    // visible y reemplazamos los datos al final para evitar parpadeo.
    const isInitialLoad = this.customers.length === 0;
    if (isInitialLoad) this.loading = true;
    this.loadError = null;
    try {
      const res = await firstValueFrom(this.customersService.getCustomers(0, 1000));
      this.customers = (res.items || []).sort(
        (a, b) => Number(b.qbId || 0) - Number(a.qbId || 0),
      );
    } catch (err) {
      this.loadError = this.handleError(err);
    } finally {
      if (isInitialLoad) this.loading = false;
    }
  }

  async syncNow(): Promise<void> {
    if (this.syncing) return;
    this.syncing = true;
    try {
      const result = await firstValueFrom(this.customersService.syncCustomers());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
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
    this.bsModalRef.content.title = this.translate.instant('QUICKBOOKS.MODAL_CREATE_TITLE');
    this.bsModalRef.content.customer = null;
    this.bsModalRef.onHidden?.subscribe(() => this.loadCustomers());
  }

  editCustomer(customer: IQbCustomer): void {
    this.bsModalRef = this.modalService.show(EditCustomerComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = this.translate.instant('QUICKBOOKS.MODAL_EDIT_TITLE');
    this.bsModalRef.content.customer = customer;
    this.bsModalRef.onHidden?.subscribe(() => this.loadCustomers());
  }

  async toggleActive(customer: IQbCustomer): Promise<void> {
    const willActivate = customer.active !== 1;

    // Guard preventivo: QB no deja desactivar customers con balance != 0.
    if (!willActivate && Math.abs(Number(customer.balance) || 0) > 0.001) {
      this.toast.warning(
        this.translate.instant('QUICKBOOKS.BLOCK_DEACTIVATE_BALANCE'),
        'QuickBooks',
        { timeOut: 10000 },
      );
      return;
    }

    // Guard preventivo: QB tampoco deja desactivar customers con sub-customers (jobs)
    // activos con balance != 0. Detectamos sub-customers usando parentRef.
    if (!willActivate) {
      const blockingChildren = this.customers.filter(
        (x) =>
          x.parentRef === customer.qbId &&
          x.active === 1 &&
          Math.abs(Number(x.balance) || 0) > 0.001,
      );
      if (blockingChildren.length > 0) {
        const names = blockingChildren.map((b) => b.displayName).join(', ');
        this.toast.warning(
          this.translate.instant('QUICKBOOKS.BLOCK_DEACTIVATE_SUBCUSTOMERS', { names }),
          'QuickBooks',
          { timeOut: 10000 },
        );
        return;
      }
    }

    const confirmed = await this.sweetAlertService.alertStatesMessage();
    if (!confirmed) return;

    try {
      await firstValueFrom(
        this.customersService.setCustomerActive(customer.qbId, willActivate),
      );
      const toastKey = willActivate ? 'QUICKBOOKS.TOAST_ACTIVATED' : 'QUICKBOOKS.TOAST_DEACTIVATED';
      this.toast.success(this.translate.instant(toastKey));
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

  private handleError(err: any): string {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    return e.message || 'Error';
  }
}
