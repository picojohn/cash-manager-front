import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { QuickbooksService } from './services/quickbooks.service';
import { CustomersService } from '../customers/services/customers.service';
import { ItemsService } from '../items/services/items.service';
import { InvoicesService } from '../invoices/services/invoices.service';
import { AccountsService } from '../accounts/services/accounts.service';
import {
  IQbSyncLog,
  IQbWebhookLog,
  IQuickbooksCompanyInfo,
  IQuickbooksStatus,
} from './interface/quickbooks.interface';

type EntityKey = 'Customer' | 'Item' | 'Invoice' | 'Account';

interface EntityState {
  key: EntityKey;
  titleI18n: string;
  iconClass: string;
  count: number;
  lastSync: IQbSyncLog | null;
  syncing: boolean;
}

@Component({
  selector: 'app-qb-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css'],
})
export class EstadoComponent implements OnInit {
  public status: IQuickbooksStatus = { connected: false };
  public companyInfo: IQuickbooksCompanyInfo['CompanyInfo'] | null = null;
  public loading: boolean = false;
  public connecting: boolean = false;
  public syncingAll: boolean = false;

  public entities: Array<EntityState> = [
    { key: 'Account', titleI18n: 'QUICKBOOKS.LOCAL_ACCOUNTS', iconClass: 'fa-solid fa-book', count: 0, lastSync: null, syncing: false },
    { key: 'Customer', titleI18n: 'QUICKBOOKS.LOCAL_CUSTOMERS', iconClass: 'fa-solid fa-users', count: 0, lastSync: null, syncing: false },
    { key: 'Item', titleI18n: 'QUICKBOOKS.LOCAL_ITEMS', iconClass: 'fa-solid fa-box', count: 0, lastSync: null, syncing: false },
    { key: 'Invoice', titleI18n: 'QUICKBOOKS.LOCAL_INVOICES', iconClass: 'fa-solid fa-file-invoice-dollar', count: 0, lastSync: null, syncing: false },
  ];

  /** Sync automatico */
  public webhookLogs: Array<IQbWebhookLog> = [];
  public lastCdc: IQbSyncLog | null = null;
  public showAllWebhooks: boolean = false;

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private sweetAlertService: SweetAlertService,
    private quickbooksService: QuickbooksService,
    private customersService: CustomersService,
    private itemsService: ItemsService,
    private invoicesService: InvoicesService,
    private accountsService: AccountsService,
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
      const [
        info,
        accountsCount,
        customersCount,
        itemsCount,
        invoicesCount,
        accountLog,
        customerLog,
        itemLog,
        invoiceLog,
        cdcLog,
        webhookLogs,
      ] = await Promise.all([
        firstValueFrom(this.quickbooksService.getCompanyInfo()),
        firstValueFrom(this.accountsService.getLocalAccountsCount()),
        firstValueFrom(this.customersService.getCustomersCount()),
        firstValueFrom(this.itemsService.getItemsCount()),
        firstValueFrom(this.invoicesService.getInvoicesCount()),
        firstValueFrom(this.quickbooksService.getSyncStatus('Account')),
        firstValueFrom(this.quickbooksService.getSyncStatus('Customer')),
        firstValueFrom(this.quickbooksService.getSyncStatus('Item')),
        firstValueFrom(this.quickbooksService.getSyncStatus('Invoice')),
        firstValueFrom(this.quickbooksService.getSyncStatus('CDC')),
        firstValueFrom(this.quickbooksService.getWebhookLogs(20)),
      ]);
      this.companyInfo = info.CompanyInfo;
      this.entities[0].count = accountsCount.count;
      this.entities[1].count = customersCount.count;
      this.entities[2].count = itemsCount.count;
      this.entities[3].count = invoicesCount.count;
      this.entities[0].lastSync = accountLog;
      this.entities[1].lastSync = customerLog;
      this.entities[2].lastSync = itemLog;
      this.entities[3].lastSync = invoiceLog;
      this.lastCdc = cdcLog;
      this.webhookLogs = webhookLogs || [];
    } catch (err) {
      this.handleError(err);
    }
  }

  get latestWebhook(): IQbWebhookLog | null {
    return this.webhookLogs?.[0] || null;
  }

  toggleWebhookList(): void {
    this.showAllWebhooks = !this.showAllWebhooks;
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

  async syncEntity(entity: EntityState): Promise<void> {
    if (entity.syncing || this.syncingAll) return;
    entity.syncing = true;
    try {
      let result;
      if (entity.key === 'Account') {
        result = await firstValueFrom(this.accountsService.syncAccounts());
      } else if (entity.key === 'Customer') {
        result = await firstValueFrom(this.customersService.syncCustomers());
      } else if (entity.key === 'Item') {
        result = await firstValueFrom(this.itemsService.syncItems());
      } else {
        result = await firstValueFrom(this.invoicesService.syncInvoices());
      }
      this.toast.success(this.buildSyncToast(entity.key, result));
      await this.loadConnectedData();
    } catch (err) {
      this.handleError(err);
    } finally {
      entity.syncing = false;
    }
  }

  async syncAll(): Promise<void> {
    if (this.syncingAll) return;
    this.syncingAll = true;
    this.entities.forEach((e) => (e.syncing = true));
    try {
      const all: any = await this.quickbooksService.syncAll();
      const parts: Array<string> = [];
      const order: Array<[EntityKey, string]> = [
        ['Account', 'accounts'],
        ['Customer', 'customers'],
        ['Item', 'items'],
        ['Invoice', 'invoices'],
      ];
      for (const [k, prop] of order) {
        const r = all[prop];
        if (!r) continue;
        if ((r as any).error) {
          parts.push(`${k}: ❌`);
        } else {
          parts.push(`${k}: ${r.recordsCreated}+${r.recordsUpdated}`);
        }
      }
      this.toast.success(`${this.translate.instant('QUICKBOOKS.TOAST_SYNC_ALL_OK')}: ${parts.join(' | ')}`);
      await this.loadConnectedData();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncingAll = false;
      this.entities.forEach((e) => (e.syncing = false));
    }
  }

  private buildSyncToast(key: EntityKey, result: any): string {
    return `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')} (${key}): ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
  }

  async disconnect(): Promise<void> {
    const confirmed = await this.sweetAlertService.alertStatesMessage();
    if (!confirmed) return;
    try {
      await firstValueFrom(this.quickbooksService.disconnect());
      this.toast.success(this.translate.instant('QUICKBOOKS.TOAST_DISCONNECTED'));
      this.status = { connected: false };
      this.companyInfo = null;
      this.entities.forEach((e) => {
        e.count = 0;
        e.lastSync = null;
      });
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
