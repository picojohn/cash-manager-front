import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { QuickbooksService } from '../services/quickbooks.service';
import { IQbCustomer } from '../interface/quickbooks.interface';

@Component({
  selector: 'app-qb-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  public customers: Array<IQbCustomer> = [];
  public totalCustomers: number = 0;
  public loading: boolean = false;
  public syncing: boolean = false;

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 10;
  public page: number = 1;
  public _buscador: string = '';

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private quickbooksService: QuickbooksService,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  async loadCustomers(): Promise<void> {
    this.loading = true;
    try {
      // Por ahora bajamos todos (max 1000) y filtramos client-side.
      // Cuando crezca, paginamos server-side (skip/take + filter parameter).
      const res = await firstValueFrom(this.quickbooksService.getCustomers(0, 1000));
      this.customers = res.items;
      this.totalCustomers = res.total;
    } catch (err) {
      this.handleError(err);
    } finally {
      this.loading = false;
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

  filterData(): Array<IQbCustomer> {
    if (!this._buscador) return this.customers;
    const q = this._buscador.toLowerCase();
    return this.customers.filter(
      (c) =>
        c.displayName?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.primaryEmail?.toLowerCase().includes(q) ||
        c.qbId?.toLowerCase().includes(q),
    );
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
