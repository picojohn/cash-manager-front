import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { BillPaymentsService } from './services/bill-payments.service';
import { IQbBillPayment } from './interface/bill-payment.interface';

@Component({
  selector: 'app-qb-bill-payments',
  templateUrl: './bill-payments.component.html',
  styleUrls: ['./bill-payments.component.css'],
})
export class BillPaymentsComponent implements OnInit {
  public billPayments: Array<IQbBillPayment> = [];
  public loading: boolean = false;
  public loadError: string | null = null;
  public syncing: boolean = false;

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 25;
  public page: number = 1;
  public _buscador: string = '';

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private billPaymentsService: BillPaymentsService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadBillPayments();
  }

  async loadBillPayments(): Promise<void> {
    const isInitialLoad = this.billPayments.length === 0;
    if (isInitialLoad) this.loading = true;
    this.loadError = null;
    try {
      const res = await firstValueFrom(this.billPaymentsService.getBillPayments(0, 1000));
      this.billPayments = (res.items || []).sort(
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
      const result = await firstValueFrom(this.billPaymentsService.syncBillPayments());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
      await this.loadBillPayments();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  filterData(): Array<IQbBillPayment> {
    let list = this.billPayments;
    if (this._buscador) {
      const q = this._buscador.toLowerCase();
      list = list.filter(
        (x) =>
          x.vendorName?.toLowerCase().includes(q) ||
          x.checkNum?.toLowerCase().includes(q) ||
          x.payAccountName?.toLowerCase().includes(q) ||
          x.docNumber?.toLowerCase().includes(q) ||
          x.qbId?.toLowerCase().includes(q),
      );
    }
    return list;
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
