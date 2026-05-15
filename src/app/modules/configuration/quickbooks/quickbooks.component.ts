import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { QuickbooksService } from './services/quickbooks.service';
import {
  IQuickbooksCompanyInfo,
  IQuickbooksCustomer,
  IQuickbooksStatus,
} from './interface/quickbooks.interface';

@Component({
  selector: 'app-quickbooks',
  templateUrl: './quickbooks.component.html',
  styleUrls: ['./quickbooks.component.css'],
})
export class QuickbooksComponent implements OnInit {
  public status: IQuickbooksStatus = { connected: false };
  public companyInfo: IQuickbooksCompanyInfo['CompanyInfo'] | null = null;
  public customers: Array<IQuickbooksCustomer> = [];
  public loading: boolean = false;
  public connecting: boolean = false;

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
      const status = await firstValueFrom(this.quickbooksService.getStatus());
      this.status = status;
      if (status.connected) {
        await this.loadConnectedData();
      }
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.loading = false;
    }
  }

  private async loadConnectedData(): Promise<void> {
    try {
      const [info, custs] = await Promise.all([
        firstValueFrom(this.quickbooksService.getCompanyInfo()),
        firstValueFrom(this.quickbooksService.getCustomers(1, 10)),
      ]);
      this.companyInfo = info.CompanyInfo;
      this.customers = custs.customers;
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    }
  }

  async connect(): Promise<void> {
    this.connecting = true;
    try {
      const { authUrl } = await firstValueFrom(this.quickbooksService.getConnectUrl());
      window.location.href = authUrl;
    } catch (err) {
      this.connecting = false;
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
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
      this.customers = [];
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    }
  }
}
