import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { BillsService } from '../../services/bills.service';
import { IQbBill, IQbBillLine } from '../../interface/bill.interface';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css'],
})
export class BillDetailComponent implements OnInit {
  public bill: IQbBill;
  public lines: Array<IQbBillLine> = [];
  public loading: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private billsService: BillsService,
  ) {}

  ngOnInit(): void {
    // El caller setea this.bill despues; esperamos un tick para que el binding este resuelto.
    setTimeout(() => {
      if (this.bill?.id) this.loadLines();
    }, 50);
  }

  async loadLines(): Promise<void> {
    this.loading = true;
    try {
      this.lines = await firstValueFrom(this.billsService.getBillLines(this.bill.id));
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.loading = false;
    }
  }

  /** Solo las lineas de gasto (no DescriptionOnly, no SubTotal). */
  get expenseLines(): Array<IQbBillLine> {
    return this.lines.filter(
      (l) =>
        l.detailType === 'AccountBasedExpenseLineDetail' ||
        l.detailType === 'ItemBasedExpenseLineDetail',
    );
  }
}
