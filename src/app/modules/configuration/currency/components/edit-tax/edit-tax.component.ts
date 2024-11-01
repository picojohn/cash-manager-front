import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ICountry, ITax } from '../../interface/currency.interface';
import { CurrencyService } from '../../services/currency.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';



@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrls: ['./edit-tax.component.css']
})
export class EditTaxComponent {

  public title: string;
  public tax: ITax;
  public formTax: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public countries: Array<ICountry> = []

  constructor(
    public bsModalRef: BsModalRef,
    private currencyService: CurrencyService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    this.loadData()
    setTimeout(() => {
      this.buildForms()
      this.cargarFormularioBooleam = true
    }, 100);
  }

  /**
 * carga inicial de datos
 */
  loadData() {
    firstValueFrom(this.currencyService.getCountries()).then(item => {
      this.countries = item
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }

  /**
   * Medoto que construye los formularios
   * @returns void
   */
  buildForms(): void {
    this.formTax = new FormGroup({
      id: new FormControl(this.tax ? this.tax.id : null),
      name: new FormControl(this.tax ? this.tax.name : null, [Validators.required]),
      description: new FormControl(this.tax ? this.tax.description : null, [Validators.required]),
      defaultRate: new FormControl(this.tax ? this.tax.defaultRate : null, [Validators.required]),
      idCountry: new FormControl(this.tax ? this.tax.idCountry : null, [Validators.required]),
      state: new FormControl(this.tax ? this.tax.state : 1, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos ne le backend
   * @returns ITax
   */
  saveData() {
    this.formTax.markAllAsTouched();
    if (this.formTax.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.TAX)
    const rawValue: ITax = this.formTax.value;
    firstValueFrom(this.tax ? this.currencyService.editTax(rawValue) : this.currencyService.newTax(rawValue)).then(item => {
      this.toast.success(` Impuesto ${this.tax ? 'modificado' : 'creado'} correctamente`, ETitleMessages.TAX)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
