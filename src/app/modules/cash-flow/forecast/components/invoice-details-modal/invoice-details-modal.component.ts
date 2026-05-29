import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  ICashFlowInvoiceDetail,
  ICashFlowWeek,
} from '../../interface/cash-flow.interface';

@Component({
  selector: 'app-invoice-details-modal',
  templateUrl: './invoice-details-modal.component.html',
  styleUrls: ['./invoice-details-modal.component.css'],
})
export class InvoiceDetailsModalComponent {
  public customerName: string = '';
  public invoices: Array<ICashFlowInvoiceDetail> = [];
  public weeks: Array<ICashFlowWeek> = [];

  constructor(public bsModalRef: BsModalRef) {}

  weekLabel(weekIndex: number): string {
    const w = this.weeks.find((x) => x.weekIndex === weekIndex);
    return w ? w.label : '';
  }

  get totalSubtotal(): number {
    return this.invoices.reduce((s, i) => s + (i.subtotal || 0), 0);
  }
  get totalTax(): number {
    return this.invoices.reduce((s, i) => s + (i.totalTax || 0), 0);
  }
  get totalAmt(): number {
    return this.invoices.reduce((s, i) => s + (i.totalAmt || 0), 0);
  }
  get totalBalance(): number {
    return this.invoices.reduce((s, i) => s + (i.balance || 0), 0);
  }
}
