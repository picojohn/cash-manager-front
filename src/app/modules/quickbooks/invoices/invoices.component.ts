import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { QuickbooksService } from '../services/quickbooks.service';
import { IQbInvoice } from '../interface/quickbooks.interface';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';

type PaymentFilter = 'all' | 'paid' | 'pending' | 'overdue';

@Component({
  selector: 'app-qb-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit {
  public invoices: Array<IQbInvoice> = [];
  public loading: boolean = false;
  public syncing: boolean = false;

  public filterPayment: PaymentFilter = 'all';
  public paymentOptions: Array<{ value: PaymentFilter; label: string }> = [];

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 25;
  public page: number = 1;
  public _buscador: string = '';

  private bsModalRef: BsModalRef;

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private quickbooksService: QuickbooksService,
    private modalService: BsModalService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buildOptions();
    this.translate.onLangChange.subscribe(() => this.buildOptions());
    this.loadInvoices();
  }

  private buildOptions(): void {
    this.paymentOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'paid', label: this.translate.instant('QUICKBOOKS.FILTER_PAID') },
      { value: 'pending', label: this.translate.instant('QUICKBOOKS.FILTER_PENDING') },
      { value: 'overdue', label: this.translate.instant('QUICKBOOKS.FILTER_OVERDUE') },
    ];
  }

  async loadInvoices(): Promise<void> {
    const isInitialLoad = this.invoices.length === 0;
    if (isInitialLoad) this.loading = true;
    try {
      const res = await firstValueFrom(this.quickbooksService.getInvoices(0, 1000));
      this.invoices = res.items || [];
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
      const result = await firstValueFrom(this.quickbooksService.syncInvoices());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
      await this.loadInvoices();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  viewDetail(invoice: IQbInvoice): void {
    this.bsModalRef = this.modalService.show(InvoiceDetailComponent, {
      backdrop: 'static',
      class: 'modal-xl p-5',
    });
    this.bsModalRef.content.invoice = invoice;
  }

  filterData(): Array<IQbInvoice> {
    let list = this.invoices;
    const today = new Date().toISOString().slice(0, 10);

    if (this.filterPayment === 'paid') {
      list = list.filter((x) => Number(x.balance) <= 0.001);
    } else if (this.filterPayment === 'pending') {
      list = list.filter((x) => Number(x.balance) > 0.001);
    } else if (this.filterPayment === 'overdue') {
      list = list.filter(
        (x) => Number(x.balance) > 0.001 && x.dueDate && x.dueDate < today,
      );
    }

    if (this._buscador) {
      const q = this._buscador.toLowerCase();
      list = list.filter(
        (x) =>
          x.docNumber?.toLowerCase().includes(q) ||
          x.customerName?.toLowerCase().includes(q) ||
          x.qbId?.toLowerCase().includes(q),
      );
    }
    return list;
  }

  isOverdue(inv: IQbInvoice): boolean {
    if (!inv.dueDate || Number(inv.balance) <= 0.001) return false;
    const today = new Date().toISOString().slice(0, 10);
    return inv.dueDate < today;
  }

  statusKey(inv: IQbInvoice): string {
    if (Number(inv.balance) <= 0.001) return 'QUICKBOOKS.STATUS_PAID';
    if (this.isOverdue(inv)) return 'QUICKBOOKS.STATUS_OVERDUE';
    return 'QUICKBOOKS.STATUS_PENDING';
  }

  statusClass(inv: IQbInvoice): string {
    if (Number(inv.balance) <= 0.001) return 'status-paid';
    if (this.isOverdue(inv)) return 'status-overdue';
    return 'status-pending';
  }

  onFilterChange(): void {
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
