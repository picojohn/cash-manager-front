import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { VendorsService } from './services/vendors.service';
import { IQbVendor } from './interface/vendor.interface';

type FilterStatus = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-qb-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
})
export class VendorsComponent implements OnInit {
  public vendors: Array<IQbVendor> = [];
  public loading: boolean = false;
  public syncing: boolean = false;

  public filterStatus: FilterStatus = 'all';
  public statusOptions: Array<{ value: FilterStatus; label: string }> = [];

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 25;
  public page: number = 1;
  public _buscador: string = '';

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private vendorsService: VendorsService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buildOptions();
    this.translate.onLangChange.subscribe(() => this.buildOptions());
    this.loadVendors();
  }

  private buildOptions(): void {
    this.statusOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'active', label: this.translate.instant('QUICKBOOKS.FILTER_ACTIVE') },
      { value: 'inactive', label: this.translate.instant('QUICKBOOKS.FILTER_INACTIVE') },
    ];
  }

  async loadVendors(): Promise<void> {
    const isInitialLoad = this.vendors.length === 0;
    if (isInitialLoad) this.loading = true;
    try {
      const res = await firstValueFrom(this.vendorsService.getVendors(0, 1000));
      this.vendors = (res.items || []).sort(
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
      const result = await firstValueFrom(this.vendorsService.syncVendors());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
      await this.loadVendors();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  filterData(): Array<IQbVendor> {
    let list = this.vendors;
    if (this.filterStatus === 'active') {
      list = list.filter((v) => v.active === 1);
    } else if (this.filterStatus === 'inactive') {
      list = list.filter((v) => v.active !== 1);
    }
    if (this._buscador) {
      const q = this._buscador.toLowerCase();
      list = list.filter(
        (v) =>
          v.displayName?.toLowerCase().includes(q) ||
          v.companyName?.toLowerCase().includes(q) ||
          v.primaryEmail?.toLowerCase().includes(q) ||
          v.taxIdentifier?.toLowerCase().includes(q) ||
          v.qbId?.toLowerCase().includes(q),
      );
    }
    return list;
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
