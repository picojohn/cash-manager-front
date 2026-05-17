import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { QuickbooksService } from '../../../services/quickbooks.service';
import { IQbInvoice, IQbInvoiceLine } from '../../../interface/quickbooks.interface';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
})
export class InvoiceDetailComponent implements OnInit {
  public invoice: IQbInvoice;
  public lines: Array<IQbInvoiceLine> = [];
  public loading: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private quickbooksService: QuickbooksService,
  ) {}

  ngOnInit(): void {
    if (this.invoice?.id) this.loadLines();
  }

  async loadLines(): Promise<void> {
    this.loading = true;
    try {
      this.lines = await firstValueFrom(
        this.quickbooksService.getInvoiceLines(this.invoice.id),
      );
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.loading = false;
    }
  }

  /** Devuelve solo las lineas de items (no subtotales, descripciones, descuentos) */
  get itemLines(): Array<IQbInvoiceLine> {
    return this.lines.filter((l) => l.detailType === 'SalesItemLineDetail');
  }
}
