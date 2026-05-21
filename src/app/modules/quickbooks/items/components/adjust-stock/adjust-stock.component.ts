import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ItemsService } from '../../services/items.service';
import { IQbAccount, IQbItem } from '../../interface/item.interface';

@Component({
  selector: 'app-adjust-stock',
  templateUrl: './adjust-stock.component.html',
  styleUrls: ['./adjust-stock.component.css'],
})
export class AdjustStockComponent implements OnInit {
  public item: IQbItem;

  public formAdjust: FormGroup;
  public cargarFormulario: boolean = false;
  public saving: boolean = false;
  public loadingAccounts: boolean = false;

  public adjustAccounts: Array<IQbAccount> = [];

  /** Direction toggle: 'in' (suma) o 'out' (resta) */
  public direction: 'in' | 'out' = 'in';

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private itemsService: ItemsService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForm();
      this.loadAccounts();
      this.cargarFormulario = true;
    }, 50);
  }

  buildForm(): void {
    this.formAdjust = new FormGroup({
      qty: new FormControl(null, [Validators.required, Validators.min(0.0001)]),
      adjustAccountRef: new FormControl('', [Validators.required]),
      memo: new FormControl(''),
    });
  }

  async loadAccounts(): Promise<void> {
    this.loadingAccounts = true;
    try {
      // Cuentas validas para ajuste: Expense u Other Expense
      const [exp, otherExp] = await Promise.all([
        firstValueFrom(this.itemsService.getAccounts('Expense')),
        firstValueFrom(this.itemsService.getAccounts('Other Expense')),
      ]);
      this.adjustAccounts = [
        ...((exp.accounts || []) as Array<IQbAccount>),
        ...((otherExp.accounts || []) as Array<IQbAccount>),
      ].filter((a) => a.Active !== false);
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.loadingAccounts = false;
    }
  }

  setDirection(d: 'in' | 'out'): void {
    this.direction = d;
  }

  async save(): Promise<void> {
    if (this.formAdjust.invalid) {
      this.formAdjust.markAllAsTouched();
      this.toast.info(this.translate.instant('QUICKBOOKS.TOAST_FORM_INVALID'));
      return;
    }
    if (this.saving) return;

    const raw = this.formAdjust.getRawValue();
    const qty = Number(raw.qty);
    const qtyDiff = this.direction === 'in' ? qty : -qty;

    // Validacion: no permitir restar mas de lo que hay
    if (qtyDiff < 0 && Math.abs(qtyDiff) > Number(this.item.qtyOnHand)) {
      this.toast.warning(
        this.translate.instant('QUICKBOOKS.STOCK_INSUFFICIENT', {
          qty: Number(this.item.qtyOnHand),
        }),
      );
      return;
    }

    this.saving = true;
    try {
      await firstValueFrom(
        this.itemsService.adjustItemStock(this.item.qbId, {
          qtyDiff,
          adjustAccountRef: raw.adjustAccountRef,
          memo: raw.memo || undefined,
        }),
      );
      this.toast.success(this.translate.instant('QUICKBOOKS.TOAST_STOCK_ADJUSTED'));
      this.bsModalRef.hide();
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.saving = false;
    }
  }
}
