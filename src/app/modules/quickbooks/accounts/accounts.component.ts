import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { AccountsService } from './services/accounts.service';
import { IQbAccountLocal } from './interface/account.interface';

type FilterStatus = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-qb-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  public accounts: Array<IQbAccountLocal> = [];
  public loading: boolean = false;
  public loadError: string | null = null;
  public syncing: boolean = false;

  public filterStatus: FilterStatus = 'all';
  public statusOptions: Array<{ value: FilterStatus; label: string }> = [];

  /** Tipos comunes que queremos resaltar para Cash Flow. */
  public filterType: string = 'all';
  public typeOptions: Array<{ value: string; label: string }> = [];

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 25;
  public page: number = 1;
  public _buscador: string = '';

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private accountsService: AccountsService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buildOptions();
    this.translate.onLangChange.subscribe(() => this.buildOptions());
    this.loadAccounts();
  }

  private buildOptions(): void {
    this.statusOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'active', label: this.translate.instant('QUICKBOOKS.FILTER_ACTIVE') },
      { value: 'inactive', label: this.translate.instant('QUICKBOOKS.FILTER_INACTIVE') },
    ];
    this.typeOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'Bank', label: 'Bank' },
      { value: 'Other Current Asset', label: 'Other Current Asset' },
      { value: 'Accounts Receivable', label: 'Accounts Receivable' },
      { value: 'Accounts Payable', label: 'Accounts Payable' },
      { value: 'Credit Card', label: 'Credit Card' },
      { value: 'Income', label: 'Income' },
      { value: 'Expense', label: 'Expense' },
      { value: 'Equity', label: 'Equity' },
      { value: 'Cost of Goods Sold', label: 'Cost of Goods Sold' },
      { value: 'Fixed Asset', label: 'Fixed Asset' },
      { value: 'Long Term Liability', label: 'Long Term Liability' },
    ];
  }

  async loadAccounts(): Promise<void> {
    const isInitialLoad = this.accounts.length === 0;
    if (isInitialLoad) this.loading = true;
    this.loadError = null;
    try {
      const res = await firstValueFrom(this.accountsService.getLocalAccounts());
      this.accounts = (res.items || []).sort(
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
      const result = await firstValueFrom(this.accountsService.syncAccounts());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
      await this.loadAccounts();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  filterData(): Array<IQbAccountLocal> {
    let list = this.accounts;
    if (this.filterStatus === 'active') {
      list = list.filter((x) => x.active === 1);
    } else if (this.filterStatus === 'inactive') {
      list = list.filter((x) => x.active !== 1);
    }
    if (this.filterType !== 'all') {
      list = list.filter((x) => x.accountType === this.filterType);
    }
    if (this._buscador) {
      const q = this._buscador.toLowerCase();
      list = list.filter(
        (x) =>
          x.name?.toLowerCase().includes(q) ||
          x.fullyQualifiedName?.toLowerCase().includes(q) ||
          x.qbId?.toLowerCase().includes(q),
      );
    }
    return list;
  }

  onFilterChange(): void {
    this.page = 1;
  }

  /**
   * Identifica si una cuenta es de tipo "cash" (Bank o Cash on Hand) para Cash Flow.
   */
  isCashAccount(a: IQbAccountLocal): boolean {
    return (
      a.accountType === 'Bank' ||
      (a.accountType === 'Other Current Asset' && a.accountSubType === 'CashOnHand')
    );
  }

  /** Suma de balances de cuentas cash activas. Muestra el efectivo total disponible. */
  get totalCash(): number {
    return this.accounts
      .filter((a) => a.active === 1 && this.isCashAccount(a))
      .reduce((sum, a) => sum + Number(a.currentBalance || 0), 0);
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
