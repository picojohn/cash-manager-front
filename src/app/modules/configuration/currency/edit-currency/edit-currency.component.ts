import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ICurrency } from '../interface/currency.interface';
import { CurrencyService } from '../services/currency.service';


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
    private currencyService: CurrencyService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    this.loadData()
    setTimeout(() => {
      this.cargarFormularios()
      this.cargarFormularioBooleam = true
    }, 100);
  }

  /**
 * carga inicial de datos
 */
  loadData() {

  }

  cargarFormularios() {
    this.formCurrency = new FormGroup({
      id: new FormControl(this.currency ? this.currency.id : null),
      name: new FormControl(this.currency ? this.currency.name : null, [Validators.required]),
      code: new FormControl(this.currency ? this.currency.code : null, [Validators.required]),
      // estado: new FormControl(this.cargo ? this.cargo.estado : 1, [Validators.required]),
    })
  }

  saveData() {
      this.formCurrency.markAllAsTouched();
      if (this.formCurrency.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', 'Moneda')
        const rawValue: ICurrency = this.formCurrency.value;
        firstValueFrom( this.currency? this.currencyService.editCurrency(rawValue) : this.currencyService.newCurrency(rawValue)).then(item => {
          this.toast.success(` Moneda ${this.currency? 'modificada' : 'creada'} correctamente`, 'Moneda')
          this.bsModalRef.hide()
        }, err => {
          const errorObject = this.errorService.showNotification(err);
          this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
        })

  }



}
