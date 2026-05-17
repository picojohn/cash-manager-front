import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { QuickbooksService } from '../services/quickbooks.service';
import {
  IQbSyncLog,
  IQuickbooksCompanyInfo,
  IQuickbooksStatus,
} from '../interface/quickbooks.interface';

@Component({
  selector: 'app-qb-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css'],
})
export class EstadoComponent implements OnInit {
  public status: IQuickbooksStatus = { connected: false };
  public companyInfo: IQuickbooksCompanyInfo['CompanyInfo'] | null = null;
  public lastSync: IQbSyncLog | null = null;
  public customersCount: number = 0;
  public loading: boolean = false;
  public connecting: boolean = false;
  public syncing: boolean = false;

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private sweetAlertService: SweetAlertService,
    private quickbooksService: QuickbooksService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  async loadStatus(): Promise<void> {
    this.loading = true;
    try {
      this.status = await firstValueFrom(this.quickbooksService.getStatus());
      if (this.status.connected) {
        await this.loadConnectedData();
      }
    } catch (err) {
      this.handleError(err);
    } finally {
      this.loading = false;
    }
  }

  private async loadConnectedData(): Promise<void> {
    try {
      const [info, count, lastSync] = await Promise.all([
        firstValueFrom(this.quickbooksService.getCompanyInfo()),
        firstValueFrom(this.quickbooksService.getCustomersCount()),
        firstValueFrom(this.quickbooksService.getSyncStatus('Customer')),
      ]);
      this.companyInfo = info.CompanyInfo;
      this.customersCount = count.count;
      this.lastSync = lastSync;
    } catch (err) {
      this.handleError(err);
    }
  }

  async connect(): Promise<void> {
    this.connecting = true;
    try {
      const { authUrl } = await firstValueFrom(this.quickbooksService.getConnectUrl());
      window.location.href = authUrl;
    } catch (err) {
      this.connecting = false;
      this.handleError(err);
    }
  }

  async syncNow(): Promise<void> {
    if (this.syncing) return;
    this.syncing = true;
    try {
      const result = await firstValueFrom(this.quickbooksService.syncCustomers());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')} (${result.recordsFetched} ${this.translate.instant('QUICKBOOKS.RESULT_TOTAL')})`;
      this.toast.success(msg);
      await this.loadConnectedData();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  async disconnect(): Promise<void> {
    const confirmed = await this.sweetAlertService.alertStatesMessage();
    if (!confirmed) return;
    try {
      await firstValueFrom(this.quickbooksService.disconnect());
      this.toast.success(this.translate.instant('QUICKBOOKS.TOAST_DISCONNECTED'));
      this.status = { connected: false };
      this.companyInfo = null;
      this.lastSync = null;
      this.customersCount = 0;
    } catch (err) {
      this.handleError(err);
    }
  }

  formatRelative(dateStr: string): string {
    if (!dateStr) return '—';
    const now = new Date().getTime();
    const then = new Date(dateStr).getTime();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return this.translate.instant('QUICKBOOKS.TIME_FEW_SECONDS');
    if (diffMin < 60) return this.translate.instant('QUICKBOOKS.TIME_MIN_AGO', { n: diffMin });
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return this.translate.instant('QUICKBOOKS.TIME_HOUR_AGO', { n: diffH });
    const diffD = Math.floor(diffH / 24);
    return this.translate.instant('QUICKBOOKS.TIME_DAY_AGO', { n: diffD });
  }

  private handleError(err: any): void {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
  }
}
