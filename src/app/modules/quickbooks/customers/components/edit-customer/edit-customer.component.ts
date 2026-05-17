import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { QuickbooksService } from '../../../services/quickbooks.service';
import { IQbCustomer, IQbCustomerInput } from '../../../interface/quickbooks.interface';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css'],
})
export class EditCustomerComponent implements OnInit {
  /** Titulo del modal (lo setea el caller) */
  public title: string;
  /** Customer existente (si se edita) o null/undefined si se crea */
  public customer: IQbCustomer | null;

  public formCustomer: FormGroup;
  public cargarFormulario: boolean = false;
  public saving: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private quickbooksService: QuickbooksService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForm();
      this.cargarFormulario = true;
    }, 50);
  }

  buildForm() {
    this.formCustomer = new FormGroup({
      displayName: new FormControl(this.customer?.displayName || '', [Validators.required]),
      companyName: new FormControl(this.customer?.companyName || ''),
      givenName: new FormControl(this.customer?.givenName || ''),
      familyName: new FormControl(this.customer?.familyName || ''),
      email: new FormControl(this.customer?.primaryEmail || '', [
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
      ]),
      phone: new FormControl(this.customer?.primaryPhone || ''),
    });
  }

  async save(): Promise<void> {
    if (this.formCustomer.invalid) {
      this.formCustomer.markAllAsTouched();
      this.toast.info('Revisá los campos requeridos');
      return;
    }
    if (this.saving) return;
    this.saving = true;

    const dto: IQbCustomerInput = {
      displayName: this.formCustomer.value.displayName,
      companyName: this.formCustomer.value.companyName || undefined,
      givenName: this.formCustomer.value.givenName || undefined,
      familyName: this.formCustomer.value.familyName || undefined,
      email: this.formCustomer.value.email || undefined,
      phone: this.formCustomer.value.phone || undefined,
    };

    try {
      if (this.customer) {
        await firstValueFrom(this.quickbooksService.updateCustomer(this.customer.qbId, dto));
        this.toast.success('Customer actualizado en QuickBooks');
      } else {
        await firstValueFrom(this.quickbooksService.createCustomer(dto));
        this.toast.success('Customer creado en QuickBooks');
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
