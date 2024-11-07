import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { IType } from '../../interface/currency.interface';
import { CurrencyService } from '../../services/currency.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';


@Component({
  selector: 'app-type-group',
  templateUrl: './edit-type.component.html',
  styleUrls: ['./edit-type.component.css']
})
export class EditTypeComponent {

  public title: string;
  public type: IType;
  public formType: FormGroup;
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
    console.log(this.datosUsuario);

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
    this.formType = new FormGroup({
      id: new FormControl(this.type ? this.type.id : null),
      name: new FormControl(this.type ? this.type.name : null, [Validators.required]),
      idCompany: new FormControl(this.type ? this.type.idCompany : this.datosUsuario.idCompany, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos en el backend
   * @returns ICurrency
   */
  saveData() {
    this.formType.markAllAsTouched();
    if (this.formType.invalid) return this.toast.info('Debes llenar todos los datos requeridos del formulario', ETitleMessages.TYPES)
    const rawValue: IType = this.formType.value;
    firstValueFrom(this.type ? this.currencyService.editType(rawValue) : this.currencyService.newType(rawValue)).then(_ => {
      this.toast.success(`Tipo ${this.type ? 'modificado' : 'creado'} correctamente`, ETitleMessages.TYPES)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
