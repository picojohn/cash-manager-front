import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
      this.toast.success(
        `Sync OK: ${result.recordsCreated} nuevos, ${result.recordsUpdated} actualizados (${result.recordsFetched} en total)`,
      );
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
      this.toast.success('QuickBooks desconectado');
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
    if (diffMin < 1) return 'hace unos segundos';
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `hace ${diffH} h`;
    const diffD = Math.floor(diffH / 24);
    return `hace ${diffD} día(s)`;
  }

  private handleError(err: any): void {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
  }
}
