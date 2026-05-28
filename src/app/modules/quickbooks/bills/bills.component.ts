import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { BillsService } from './services/bills.service';
import { IQbBill } from './interface/bill.interface';
import { BillDetailComponent } from './components/bill-detail/bill-detail.component';

type PaymentFilter = 'all' | 'paid' | 'pending' | 'overdue';

@Component({
  selector: 'app-qb-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css'],
})
export class BillsComponent implements OnInit {
  public bills: Array<IQbBill> = [];
  public loading: boolean = false;
  public loadError: string | null = null;
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
    private billsService: BillsService,
    private modalService: BsModalService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buildOptions();
    this.translate.onLangChange.subscribe(() => this.buildOptions());
    this.loadBills();
  }

  private buildOptions(): void {
    this.paymentOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'paid', label: this.translate.instant('QUICKBOOKS.FILTER_PAID') },
      { value: 'pending', label: this.translate.instant('QUICKBOOKS.FILTER_PENDING') },
      { value: 'overdue', label: this.translate.instant('QUICKBOOKS.FILTER_OVERDUE') },
    ];
  }

  async loadBills(): Promise<void> {
    const isInitialLoad = this.bills.length === 0;
    if (isInitialLoad) this.loading = true;
    this.loadError = null;
    try {
      const res = await firstValueFrom(this.billsService.getBills(0, 1000));
      this.bills = (res.items || []).sort(
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
      const result = await firstValueFrom(this.billsService.syncBills());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
      await this.loadBills();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  viewDetail(bill: IQbBill): void {
    this.bsModalRef = this.modalService.show(BillDetailComponent, {
      backdrop: 'static',
      class: 'modal-xl p-5',
    });
    this.bsModalRef.content.bill = bill;
  }

  filterData(): Array<IQbBill> {
    let list = this.bills;
    const today = new Date().toISOString().slice(0, 10);

    if (this.filterPayment === 'paid') {
      list = list.filter((x) => Number(x.balance) <= 0.001);
    } else if (this.filterPayment === 'pending') {
      list = list.filter(
        (x) => Number(x.balance) > 0.001 && !(x.dueDate && x.dueDate < today),
      );
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
          x.vendorName?.toLowerCase().includes(q) ||
          x.qbId?.toLowerCase().includes(q),
      );
    }
    return list;
  }

  isOverdue(bill: IQbBill): boolean {
    if (!bill.dueDate || Number(bill.balance) <= 0.001) return false;
    const today = new Date().toISOString().slice(0, 10);
    return bill.dueDate < today;
  }

  statusKey(bill: IQbBill): string {
    if (Number(bill.balance) <= 0.001) return 'QUICKBOOKS.STATUS_PAID';
    if (this.isOverdue(bill)) return 'QUICKBOOKS.STATUS_OVERDUE';
    return 'QUICKBOOKS.STATUS_PENDING';
  }

  statusClass(bill: IQbBill): string {
    if (Number(bill.balance) <= 0.001) return 'status-paid';
    if (this.isOverdue(bill)) return 'status-overdue';
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

  private handleError(err: any): string {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    return e.message || 'Error';
  }
}
