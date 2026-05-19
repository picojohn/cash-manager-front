import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { QuickbooksService } from '../../../services/quickbooks.service';
import {
  IQbAccount,
  IQbItem,
  IQbItemCreate,
  IQbItemUpdate,
} from '../../../interface/quickbooks.interface';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit {
  /** Titulo del modal */
  public title: string;
  /** Item existente (al editar) o null (al crear) */
  public item: IQbItem | null;

  public formItem: FormGroup;
  public cargarFormulario: boolean = false;
  public saving: boolean = false;
  public loadingAccounts: boolean = false;

  public incomeAccounts: Array<IQbAccount> = [];

  /** Solo se ofrecen Service y NonInventory al crear (Inventory requiere mas campos) */
  public typeOptions = [
    { value: 'Service', label: 'Service' },
    { value: 'NonInventory', label: 'NonInventory' },
  ];

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private quickbooksService: QuickbooksService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    // El caller setea this.item despues; esperamos un tick y ahi armamos.
    setTimeout(() => {
      this.buildForm();
      this.loadAccounts();
      this.cargarFormulario = true;
    }, 50);
  }

  get isEdit(): boolean {
    return !!this.item;
  }

  buildForm(): void {
    this.formItem = new FormGroup({
      name: new FormControl(this.item?.name || '', [Validators.required]),
      type: new FormControl(
        { value: this.item?.type || 'Service', disabled: this.isEdit },
        [Validators.required],
      ),
      sku: new FormControl(this.item?.sku || ''),
      description: new FormControl(this.item?.description || ''),
      unitPrice: new FormControl(this.item?.unitPrice ?? 0, [Validators.min(0)]),
      purchaseCost: new FormControl(this.item?.purchaseCost ?? 0, [Validators.min(0)]),
      incomeAccountRef: new FormControl(this.item?.incomeAccountRef || '', [
        Validators.required,
      ]),
      taxable: new FormControl(this.item?.taxable === 1),
    });
  }

  async loadAccounts(): Promise<void> {
    this.loadingAccounts = true;
    try {
      const res = await firstValueFrom(this.quickbooksService.getAccounts('Income'));
      this.incomeAccounts = (res.accounts || []).filter((a) => a.Active !== false);
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.loadingAccounts = false;
    }
  }

  async save(): Promise<void> {
    if (this.formItem.invalid) {
      this.formItem.markAllAsTouched();
      this.toast.info(this.translate.instant('QUICKBOOKS.TOAST_FORM_INVALID'));
      return;
    }
    if (this.saving) return;
    this.saving = true;

    const raw = this.formItem.getRawValue();

    try {
      if (this.isEdit) {
        const dto: IQbItemUpdate = {
          name: raw.name,
          sku: raw.sku || undefined,
          description: raw.description || undefined,
          unitPrice: Number(raw.unitPrice) || 0,
          purchaseCost: Number(raw.purchaseCost) || 0,
          incomeAccountRef: raw.incomeAccountRef,
          taxable: !!raw.taxable,
        };
        await firstValueFrom(this.quickbooksService.updateItem(this.item.qbId, dto));
        this.toast.success(this.translate.instant('QUICKBOOKS.TOAST_ITEM_UPDATED'));
      } else {
        const dto: IQbItemCreate = {
          name: raw.name,
          type: raw.type,
          incomeAccountRef: raw.incomeAccountRef,
          sku: raw.sku || undefined,
          description: raw.description || undefined,
          unitPrice: Number(raw.unitPrice) || 0,
          purchaseCost: Number(raw.purchaseCost) || 0,
          taxable: !!raw.taxable,
          active: true,
        };
        await firstValueFrom(this.quickbooksService.createItem(dto));
        this.toast.success(this.translate.instant('QUICKBOOKS.TOAST_ITEM_CREATED'));
      }
      this.bsModalRef.hide();
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.saving = false;
    }
  }
}
