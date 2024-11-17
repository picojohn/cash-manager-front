import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ICurrency } from '../../interface/application.interface';
import { ApplicationService } from '../../services/application.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';


@Component({
  selector: 'app-edit-currency',
  templateUrl: './edit-currency.component.html',
  styleUrls: ['./edit-currency.component.css']
})
export class EditCurrencyComponent {

  public title: string;
  public currency: ICurrency;
  public formCurrency: FormGroup;
  public cargarFormularioBooleam: boolean = false

  constructor(
    public bsModalRef: BsModalRef,
    private applicationService: ApplicationService,
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
    this.formCurrency = new FormGroup({
      id: new FormControl(this.currency ? this.currency.id : null),
      name: new FormControl(this.currency ? this.currency.name : null, [Validators.required]),
      code: new FormControl(this.currency ? this.currency.code : null, [Validators.required]),
      // estado: new FormControl(this.cargo ? this.cargo.estado : 1, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos en el backend
   * @returns ICurrency
   */
  saveData() {
    this.formCurrency.markAllAsTouched();
    if (this.formCurrency.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.CURRENCY)
    const rawValue: ICurrency = this.formCurrency.value;
    firstValueFrom(this.currency ? this.applicationService.editCurrency(rawValue) : this.applicationService.newCurrency(rawValue)).then(item => {
      this.toast.success(` Moneda ${this.currency ? 'modificada' : 'creada'} correctamente`, ETitleMessages.CURRENCY)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
