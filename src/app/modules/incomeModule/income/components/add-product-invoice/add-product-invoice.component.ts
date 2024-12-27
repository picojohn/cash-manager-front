import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';

import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { ICategory, IName, ITax, IType } from 'src/app/modules/configuration/application/interface/application.interface';
import { IncomeService } from '../../services/invcome.service';
import { constProductService } from 'src/app/shared/data/const';



@Component({
  selector: 'app-add-product-invoice',
  templateUrl: './add-product-invoice.component.html',
  styleUrls: ['./add-product-invoice.component.css']
})
export class AddProductInvoiceComponent {

  public title: string;
  public name: string
  public formProduct: FormGroup;
  public cargarFormularioBooleam: boolean = false;
  public taxes: Array<ITax> = [];
  public types: Array<IType> = [];
  public categories: Array<ICategory> = [];
  public idCompany: number;
  public productType: Array<IName> = constProductService;
  public onClose: EventEmitter<any> = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private incomeService: IncomeService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    // temporal minetras se define la compañoa
    this.idCompany = 1
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

    firstValueFrom(this.incomeService.getTaxes()).then(taxesBack => {
      this.taxes = taxesBack
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

    firstValueFrom(this.incomeService.getTypesIdCompany(this.idCompany)).then(typesIdCompanyBack => {
      this.types = typesIdCompanyBack
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

    firstValueFrom(this.incomeService.getCategoriesIdCompany(this.idCompany)).then(categoriesIdCompanyBack => {
      this.categories = categoriesIdCompanyBack
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
    this.formProduct = new FormGroup({
      name: new FormControl(this.name, [Validators.required]),
      idTax: new FormControl(null, [Validators.required]),
      idCompany: new FormControl(this.idCompany, [Validators.required]),
      idType: new FormControl(null, [Validators.required]),
      idCategory: new FormControl(null, [Validators.required]),
      idProductType: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),

    })
  }

  /**
   * metodo para guardar los datos ne le backend
   * @returns ITax
   */
  saveData() {
    this.formProduct.markAllAsTouched();
    if (this.formProduct.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.PRODUCTS)
    const rawValue = this.formProduct.value;
    firstValueFrom(this.incomeService.newProduct(rawValue)).then(newProduct => {
      this.onClose.emit({ data: newProduct, isPartial: true });
      this.toast.success(` Producto creado correctamente`, ETitleMessages.PRODUCTS)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
