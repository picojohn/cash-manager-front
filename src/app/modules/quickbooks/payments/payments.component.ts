import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { PaymentsService } from './services/payments.service';
import { IQbPayment } from './interface/payment.interface';

@Component({
  selector: 'app-qb-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  public payments: Array<IQbPayment> = [];
  public loading: boolean = false;
  public syncing: boolean = false;

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 25;
  public page: number = 1;
  public _buscador: string = '';

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private paymentsService: PaymentsService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  async loadPayments(): Promise<void> {
    const isInitialLoad = this.payments.length === 0;
    if (isInitialLoad) this.loading = true;
    try {
      const res = await firstValueFrom(this.paymentsService.getPayments(0, 1000));
      this.payments = (res.items || []).sort(
        (a, b) => Number(b.qbId || 0) - Number(a.qbId || 0),
      );
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
      const result = await firstValueFrom(this.paymentsService.syncPayments());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
      await this.loadPayments();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  filterData(): Array<IQbPayment> {
    let list = this.payments;
    if (this._buscador) {
      const q = this._buscador.toLowerCase();
      list = list.filter(
        (x) =>
          x.customerName?.toLowerCase().includes(q) ||
          x.paymentRefNum?.toLowerCase().includes(q) ||
          x.depositToAccountName?.toLowerCase().includes(q) ||
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

  private handleError(err: any): void {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
  }
}
