import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ICountry } from '../interface/countries.interface';
import { CountriesService } from '../services/countries.service';
import { ICurrency } from '../../currency/interface/currency.interface';



@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.css']
})
export class EditCountryComponent {

  public title: string;
  public country: ICountry;
  public formCountry: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public currencies: Array<ICurrency> = []

  constructor(
    public bsModalRef: BsModalRef,
    private countryService: CountriesService,
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
firstValueFrom(this.countryService.getCurrencies()).then(item => {
  this.currencies = item
})
  }

  cargarFormularios() {
    this.formCountry = new FormGroup({
      id: new FormControl(this.country ? this.country.id : null),
      name: new FormControl(this.country ? this.country.name : null, [Validators.required]),
      language: new FormControl(this.country ? this.country.language : null, [Validators.required]),
      countryCode: new FormControl(this.country ? this.country.countryCode : null, [Validators.required]),
      idCurrencies: new FormControl(this.country ? this.country.idCurrencies : null, [Validators.required]),
      state: new FormControl(this.country ? this.country.state : 1, [Validators.required]),
    })
  }

  saveData() {
      this.formCountry.markAllAsTouched();
      if (this.formCountry.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', 'Pais')
        const rawValue: ICountry = this.formCountry.value;
        firstValueFrom( this.country? this.countryService.editCountry(rawValue) : this.countryService.newCountry(rawValue)).then(item => {
          this.toast.success(` Pais ${this.country? 'modificado' : 'creado'} correctamente`, 'Pais')
          this.bsModalRef.hide()
        }, err => {
          const errorObject = this.errorService.showNotification(err);
          this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
        })

  }



}
