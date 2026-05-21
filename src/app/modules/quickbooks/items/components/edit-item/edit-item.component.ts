import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ItemsService } from '../../services/items.service';
import {
  IQbAccount,
  IQbItem,
  IQbItemCreate,
  IQbItemUpdate,
} from '../../interface/item.interface';

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
  public assetAccounts: Array<IQbAccount> = [];
  public expenseAccounts: Array<IQbAccount> = [];

  public typeOptions = [
    { value: 'Service', label: 'Service' },
    { value: 'NonInventory', label: 'NonInventory' },
    { value: 'Inventory', label: 'Inventory' },
  ];

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private itemsService: ItemsService,
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
    const today = new Date().toISOString().slice(0, 10);
    this.formItem = new FormGroup({
      name: new FormControl(this.item?.name || '', [Validators.required]),
      type: new FormControl(
        { value: this.item?.type || 'Service', disabled: this.isEdit },
        [Validators.required],
      ),
      sku: new FormControl(this.item?.sku || ''),
      description: new FormControl(this.item?.description || ''),
      unitPrice: new FormControl(this.item?.unitPrice ?? null, [Validators.min(0)]),
      purchaseCost: new FormControl(this.item?.purchaseCost ?? null, [Validators.min(0)]),
      incomeAccountRef: new FormControl(this.item?.incomeAccountRef || '', [
        Validators.required,
      ]),
      taxable: new FormControl(this.item?.taxable === 1),
      // Solo aplican cuando type=Inventory
      assetAccountRef: new FormControl(this.item?.assetAccountRef || ''),
      expenseAccountRef: new FormControl(this.item?.expenseAccountRef || ''),
      qtyOnHand: new FormControl(this.item?.qtyOnHand ?? null, [Validators.min(0)]),
      invStartDate: new FormControl(today),
    });
  }

  /** Tipo actual del form (reactivo desde el template) */
  get currentType(): string {
    return this.formItem?.getRawValue?.()?.type || 'Service';
  }

  /**
   * Cuentas de ingreso filtradas segun el tipo actual del item.
   * QB exige que para Inventory items la income tenga AccountSubType='SalesOfProductIncome'.
   */
  get filteredIncomeAccounts(): Array<IQbAccount> {
    if (this.currentType === 'Inventory') {
      return this.incomeAccounts.filter((a) => a.AccountSubType === 'SalesOfProductIncome');
    }
    return this.incomeAccounts;
  }

  async loadAccounts(): Promise<void> {
    this.loadingAccounts = true;
    try {
      const [income, asset, expense] = await Promise.all([
        firstValueFrom(this.itemsService.getAccounts('Income')),
        firstValueFrom(this.itemsService.getAccounts('Other Current Asset')),
        firstValueFrom(this.itemsService.getAccounts('Cost of Goods Sold')),
      ]);
      this.incomeAccounts = (income.accounts || []).filter((a) => a.Active !== false);
      // QB exige que la cuenta de inventario tenga AccountSubType='Inventory'.
      // No basta con que sea Other Current Asset (Prepaid Expenses tambien lo es).
      this.assetAccounts = (asset.accounts || []).filter(
        (a) => a.Active !== false && a.AccountSubType === 'Inventory',
      );
      this.expenseAccounts = (expense.accounts || []).filter((a) => a.Active !== false);
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

    const raw = this.formItem.getRawValue();

    // Validacion extra para Inventory al crear
    if (!this.isEdit && raw.type === 'Inventory') {
      if (!raw.assetAccountRef || !raw.expenseAccountRef) {
        this.toast.warning(this.translate.instant('QUICKBOOKS.INVENTORY_ACCOUNTS_REQUIRED'));
        return;
      }
    }

    if (this.saving) return;
    this.saving = true;

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
        await firstValueFrom(this.itemsService.updateItem(this.item.qbId, dto));
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
        if (raw.type === 'Inventory') {
          dto.assetAccountRef = raw.assetAccountRef;
          dto.expenseAccountRef = raw.expenseAccountRef;
          dto.qtyOnHand = Number(raw.qtyOnHand) || 0;
          dto.invStartDate = raw.invStartDate;
        }
        await firstValueFrom(this.itemsService.createItem(dto));
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
