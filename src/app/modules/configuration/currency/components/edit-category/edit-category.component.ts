import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ICategory, IGroup, IName, IType } from '../../interface/currency.interface';
import { CurrencyService } from '../../services/currency.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { constClassificationDate, constSeccionDate } from 'src/app/shared/data/const';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';



@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent {

  public title: string;
  public category: ICategory;
  public formCategory: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public types: Array<IType> = []
  public groups: Array<IGroup> = []
  public datosUsuario: IDatosUsuario


  //constantes para los datos
  public classifications: Array<IName> = constClassificationDate
  public seccions: Array<IName> = constSeccionDate

  constructor(
    public bsModalRef: BsModalRef,
    private currencyService: CurrencyService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'))
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

    firstValueFrom(this.currencyService.getTypes()).then(typesBack => {
      this.types = typesBack
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

    firstValueFrom(this.currencyService.getGroups()).then(groupsBack => {
      this.groups = groupsBack
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
    this.formCategory = new FormGroup({
      id: new FormControl(this.category ? this.category.id : null),
      code: new FormControl(this.category ? this.category.code : null, [Validators.required]),
      category: new FormControl(this.category ? this.category.category : null, [Validators.required]),
      idClassification: new FormControl(this.category ? this.category.idClassification : null, [Validators.required]),
      idType: new FormControl(this.category ? this.category.idType : null, [Validators.required]),
      state: new FormControl(this.category ? this.category.state : 1, [Validators.required]),
      idGroup: new FormControl(this.category ? this.category.idGroup : null, [Validators.required]),
      idSection: new FormControl(this.category ? this.category.idSection : null, [Validators.required]),
      idCompany: new FormControl(this.category ? this.category.idCompany : this.datosUsuario.idCompany, [Validators.required]),
      initialBalance: new FormControl(this.category ? this.category.initialBalance : null, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos en el backend
   * @returns ICountry
   */
  saveData() {
    this.formCategory.markAllAsTouched();
    if (this.formCategory.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.CATEGORIES)
    const rawValue: ICategory = this.formCategory.value;
    firstValueFrom(this.category ? this.currencyService.editCategory(rawValue) : this.currencyService.newCategory(rawValue)).then(_ => {
      this.toast.success(` Categoría ${this.category ? 'modificada' : 'creada'} correctamente`, ETitleMessages.CATEGORIES)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
