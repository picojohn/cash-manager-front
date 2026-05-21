import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { InvoicesService } from '../../services/invoices.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { ItemsService } from '../../../items/services/items.service';
import { IQbCustomer } from '../../../customers/interface/customer.interface';
import { IQbItem } from '../../../items/interface/item.interface';
import {
  IQbInvoice,
  IQbInvoiceInput,
  IQbInvoiceLine,
  IQbInvoiceLineInput,
  IQbTaxCode,
} from '../../interface/invoice.interface';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css'],
})
export class EditInvoiceComponent implements OnInit {
  /** Titulo del modal */
  public title: string;
  /** Invoice existente al editar, null al crear */
  public invoice: IQbInvoice | null;

  public formInvoice: FormGroup;
  public cargarFormulario: boolean = false;
  public saving: boolean = false;
  public loadingRefs: boolean = false;

  public customers: Array<IQbCustomer> = [];
  public items: Array<IQbItem> = [];
  public taxCodes: Array<IQbTaxCode> = [];

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private invoicesService: InvoicesService,
    private customersService: CustomersService,
    private itemsService: ItemsService,
    private translate: TranslateService,
  ) {}

  get isEdit(): boolean {
    return !!this.invoice;
  }

  get lines(): FormArray {
    return this.formInvoice.get('lines') as FormArray;
  }

  ngOnInit(): void {
    setTimeout(async () => {
      await this.loadRefs();
      this.buildForm();
      this.cargarFormulario = true;
    }, 50);
  }

  async loadRefs(): Promise<void> {
    this.loadingRefs = true;
    try {
      const [customersRes, itemsRes, taxRes] = await Promise.all([
        firstValueFrom(this.customersService.getCustomers(0, 1000)),
        firstValueFrom(this.itemsService.getItems(0, 1000)),
        firstValueFrom(this.invoicesService.getTaxCodes()),
      ]);
      this.customers = (customersRes.items || []).filter((c) => c.active === 1);
      this.items = (itemsRes.items || []).filter((i) => i.active === 1);
      this.taxCodes = (taxRes.taxCodes || []).filter((t) => t.Active !== false);
    } catch (err) {
      const e = this.errorService.showNotification(err);
      this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    } finally {
      this.loadingRefs = false;
    }
  }

  buildForm(): void {
    const today = new Date().toISOString().slice(0, 10);
    const due = new Date();
    due.setDate(due.getDate() + 30);
    const dueStr = due.toISOString().slice(0, 10);

    this.formInvoice = new FormGroup({
      customerRef: new FormControl(this.invoice?.customerRef || '', [Validators.required]),
      txnDate: new FormControl(this.invoice?.txnDate?.slice(0, 10) || today),
      dueDate: new FormControl(this.invoice?.dueDate?.slice(0, 10) || dueStr),
      billEmail: new FormControl(this.invoice?.billEmail || ''),
      customerMemo: new FormControl(this.invoice?.customerMemo || ''),
      privateNote: new FormControl(this.invoice?.privateNote || ''),
      lines: new FormArray([]),
    });

    // Si edita, precargamos las lineas existentes
    if (this.invoice && (this.invoice as any).existingLines) {
      const existingLines: Array<IQbInvoiceLine> = (this.invoice as any).existingLines;
      existingLines
        .filter((l) => l.detailType === 'SalesItemLineDetail')
        .forEach((l) => this.lines.push(this.buildLineGroup(l)));
    } else {
      // Por default 1 linea vacia al crear
      this.lines.push(this.buildLineGroup(null));
    }
  }

  private buildLineGroup(line: IQbInvoiceLine | null): FormGroup {
    return new FormGroup({
      qbLineId: new FormControl(line?.qbLineId || null),
      itemRef: new FormControl(line?.itemRef || '', [Validators.required]),
      description: new FormControl(line?.description || ''),
      qty: new FormControl(line?.qty ?? 1, [Validators.required, Validators.min(0.0001)]),
      unitPrice: new FormControl(line?.unitPrice ?? null, [Validators.min(0)]),
      taxCodeRef: new FormControl(line?.taxCodeRef || ''),
    });
  }

  addLine(): void {
    this.lines.push(this.buildLineGroup(null));
  }

  removeLine(idx: number): void {
    if (this.lines.length <= 1) return;
    this.lines.removeAt(idx);
  }

  /**
   * Cuando se elige un item, autocompleta descripcion + precio en esa linea.
   */
  onItemChange(idx: number, itemRef: string): void {
    const item = this.items.find((i) => i.qbId === itemRef);
    if (!item) return;
    const lineGroup = this.lines.at(idx) as FormGroup;
    if (!lineGroup.get('description').value) {
      lineGroup.patchValue({ description: item.description || item.name });
    }
    if (lineGroup.get('unitPrice').value == null) {
      lineGroup.patchValue({ unitPrice: item.unitPrice });
    }
  }

  /**
   * Cuando se cambia el customer, intentamos autocompletar el email si esta vacio.
   */
  onCustomerChange(customerRef: string): void {
    const customer = this.customers.find((c) => c.qbId === customerRef);
    if (!customer) return;
    if (!this.formInvoice.get('billEmail').value && customer.primaryEmail) {
      this.formInvoice.patchValue({ billEmail: customer.primaryEmail });
    }
  }

  lineAmount(idx: number): number {
    const line = this.lines.at(idx)?.value;
    if (!line) return 0;
    const qty = Number(line.qty) || 0;
    const price = Number(line.unitPrice) || 0;
    return qty * price;
  }

  get subtotal(): number {
    return this.lines.controls.reduce((sum, _l, idx) => sum + this.lineAmount(idx), 0);
  }

  async save(): Promise<void> {
    if (this.formInvoice.invalid) {
      this.formInvoice.markAllAsTouched();
      this.toast.info(this.translate.instant('QUICKBOOKS.TOAST_FORM_INVALID'));
      return;
    }
    if (this.saving) return;
    this.saving = true;

    const raw = this.formInvoice.getRawValue();

    const linesInput: Array<IQbInvoiceLineInput> = raw.lines.map((l: any) => {
      const lineDto: IQbInvoiceLineInput = {
        itemRef: l.itemRef,
        qty: Number(l.qty) || 0,
      };
      if (l.unitPrice != null && l.unitPrice !== '') {
        lineDto.unitPrice = Number(l.unitPrice);
      }
      if (l.description) lineDto.description = l.description;
      if (l.taxCodeRef) lineDto.taxCodeRef = l.taxCodeRef;
      if (l.qbLineId) lineDto.qbLineId = l.qbLineId;
      return lineDto;
    });

    const dto: IQbInvoiceInput = {
      customerRef: raw.customerRef,
      lines: linesInput,
      txnDate: raw.txnDate || undefined,
      dueDate: raw.dueDate || undefined,
      billEmail: raw.billEmail || undefined,
      customerMemo: raw.customerMemo || undefined,
      privateNote: raw.privateNote || undefined,
    };

    try {
      if (this.isEdit) {
        await firstValueFrom(this.invoicesService.updateInvoice(this.invoice.qbId, dto));
        this.toast.success(this.translate.instant('QUICKBOOKS.TOAST_INVOICE_UPDATED'));
      } else {
        await firstValueFrom(this.invoicesService.createInvoice(dto));
        this.toast.success(this.translate.instant('QUICKBOOKS.TOAST_INVOICE_CREATED'));
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
