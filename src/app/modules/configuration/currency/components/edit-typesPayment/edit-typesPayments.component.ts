import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ITypesPayment } from '../../interface/currency.interface';
import { CurrencyService } from '../../services/currency.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';


@Component({
  selector: 'app-typesPayments-group',
  templateUrl: './edit-typesPayments.component.html',
  styleUrls: ['./edit-typesPayments.component.css']
})
export class EditTypesPaymentsComponent {

  public title: string;
  public typesPayment: ITypesPayment;
  public formTypesPayments: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public datosUsuario: IDatosUsuario

  constructor(
    public bsModalRef: BsModalRef,
    private currencyService: CurrencyService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'))
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
    this.formTypesPayments = new FormGroup({
      id: new FormControl(this.typesPayment ? this.typesPayment.id : null),
      name: new FormControl(this.typesPayment ? this.typesPayment.name : null, [Validators.required]),
      idCompany: new FormControl(this.typesPayment ? this.typesPayment.idCompany : this.datosUsuario.idCompany, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos en el backend
   * @returns ICurrency
   */
  saveData() {
    this.formTypesPayments.markAllAsTouched();
    if (this.formTypesPayments.invalid) return this.toast.info('Debes llenar todos los datos requeridos del formulario', ETitleMessages.TYPESPAYMENTS)
    const rawValue: ITypesPayment = this.formTypesPayments.value;
    firstValueFrom(this.typesPayment ? this.currencyService.editTypesPayment(rawValue) : this.currencyService.newTypesPayment(rawValue)).then(_ => {
      this.toast.success(`Medio de pago ${this.typesPayment ? 'modificado' : 'creado'} correctamente`, ETitleMessages.TYPESPAYMENTS)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
