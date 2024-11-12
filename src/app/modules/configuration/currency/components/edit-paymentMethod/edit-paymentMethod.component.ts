import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ICurrency, IPaymentMethod } from '../../interface/currency.interface';
import { CurrencyService } from '../../services/currency.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';


@Component({
  selector: 'app-edit-paymentMethod',
  templateUrl: './edit-paymentMethod.component.html',
  styleUrls: ['./edit-paymentMethod.component.css']
})
export class EditPaymentMethodComponent {

  public title: string;
  public paymentMethod: IPaymentMethod;
  public formPaymentMethod: FormGroup;
  public cargarFormularioBooleam: boolean = false

  constructor(
    public bsModalRef: BsModalRef,
    private currencyService: CurrencyService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForms()
      this.cargarFormularioBooleam = true
    }, 100);
  }


  /**
   * Medoto que construye los formularios
   * @returns void
   */
  buildForms(): void {
    this.formPaymentMethod = new FormGroup({
      id: new FormControl(this.paymentMethod ? this.paymentMethod.id : null),
      name: new FormControl(this.paymentMethod ? this.paymentMethod.name : null, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos en el backend
   * @returns ICurrency
   */
  saveData() {
    this.formPaymentMethod.markAllAsTouched();
    if (this.formPaymentMethod.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.PAYMENTMETHOD)
    const rawValue: IPaymentMethod = this.formPaymentMethod.value;
    firstValueFrom(this.paymentMethod ? this.currencyService.editPaymentMethod(rawValue) : this.currencyService.newPaymentMethod(rawValue)).then(item => {
      this.toast.success(` Forma de pago ${this.paymentMethod ? 'modificada' : 'creada'} correctamente`, ETitleMessages.PAYMENTMETHOD)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
