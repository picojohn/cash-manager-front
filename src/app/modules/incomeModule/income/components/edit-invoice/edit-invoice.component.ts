import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom, Subject } from 'rxjs';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';
import { ICategory, ICurrency, IName, ITax } from 'src/app/modules/configuration/application/interface/application.interface';
import { constClienteCliente, constConditions, constEmpresasClientes, constMonths, constProductService, constProyecto, constUnidadNegocio, constYears } from 'src/app/shared/data/const';
import { IncomeService } from '../../services/invcome.service';
import { IInvoice } from '../../interface/income.interface';
import { AddProductInvoiceComponent } from '../add-product-invoice/add-product-invoice.component';


@Component({
  selector: 'app-invoice-group',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})
export class EditInvoiceComponent {

  private bsModalRefModal: BsModalRef;

  public title: string;
  public invoice: IInvoice;
  public formInvoice: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public datosUsuario: IDatosUsuario;

  public conditions: Array<IName> = constConditions;
  public companiesClient: Array<IName> = constEmpresasClientes;
  public unitsBusiness: Array<IName> = constUnidadNegocio;
  public proyects: Array<IName> = constProyecto;
  public client: Array<IName> = constClienteCliente;
  public months: Array<IName> = constMonths;
  public productService: Array<IName> = constProductService;

  public currencies: Array<ICurrency> = [];
  public products: Array<any> = [];
  public taxes: Array<ITax> = []
  public categories: Array<ICategory> = []

  public years: number[] = constYears

  public idCountry = 1 //////////////// temporal mientras se defino como se saca el dato del pais




  productInput$ = new Subject<string>();

  constructor(
    private modalService: BsModalService,
    public bsModalRef: BsModalRef, // cerrar madal
    private incomeService: IncomeService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private _fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.loadData()
    this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'))
    setTimeout(() => {
      this.buildForms()
      this.cargarFormularioBooleam = true
    }, 100);
  }


  loadData() {

    // const currentYear = new Date().getFullYear();
    // for (let i = currentYear - 30; i <= currentYear + 10; i++) {
    //   this.years.push(i);
    // }
    // console.log(this.years);

    firstValueFrom(this.incomeService.getCurrencys()).then(currencysItem => {
      console.log(currencysItem);
      this.currencies = currencysItem;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

    firstValueFrom(this.incomeService.getTaxes()).then(taxwsItem => {
      console.log(taxwsItem);
      this.taxes = taxwsItem;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

    firstValueFrom(this.incomeService.getCategories()).then(categoriesItem => {
      console.log(categoriesItem);
      this.categories = categoriesItem;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

    this.loadProductsBack()

  }


  loadProductsBack() {
    firstValueFrom(this.incomeService.getProducts()).then(productsItem => {
      console.log(productsItem);
      this.products = productsItem;
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
    this.formInvoice = new FormGroup({
      id: new FormControl(this.invoice ? this.invoice.id : null),
      idCompanyClient: new FormControl(this.invoice ? this.invoice.idCompanyClient : null, [Validators.required]),
      idBusinessUnit: new FormControl(this.invoice ? this.invoice.idBusinessUnit : null, [Validators.required]),
      idProyect: new FormControl(this.invoice ? this.invoice.idProyect : null, [Validators.required]),
      invoiceDate: new FormControl(this.invoice ? this.invoice.invoiceDate : null, [Validators.required]),
      idCondition: new FormControl(this.invoice ? this.invoice.idCondition : null, [Validators.required]),
      expirationDate: new FormControl(this.invoice ? this.invoice.expirationDate : null, [Validators.required]),
      invoiceNumber: new FormControl(this.invoice ? this.invoice.invoiceNumber : null, [Validators.required]),
      idClient: new FormControl(this.invoice ? this.invoice.idClient : null, [Validators.required]),
      idCurrency: new FormControl(this.invoice ? this.invoice.idCurrency : null, [Validators.required]),
      monthWorked: new FormControl(this.invoice ? this.invoice.monthWorked : null, [Validators.required]),
      yearWorked: new FormControl(this.invoice ? this.invoice.yearWorked : null, [Validators.required]),
      subTotalInvoice: new FormControl(this.invoice ? this.invoice.subTotalInvoice : null, [Validators.required]),
      taxesInvoice: new FormControl(this.invoice ? this.invoice.taxesInvoice : null, [Validators.required]),
      totalInvoice: new FormControl(this.invoice ? this.invoice.totalInvoice : null, [Validators.required]),
      comments: new FormControl(this.invoice ? this.invoice.comments : null, [Validators.required]),
      state: new FormControl(this.invoice ? Number(this.invoice.state) : 0, [Validators.required]),
      productsInvoice: new FormArray([]),
    })
  }

  get productsInvoice(): FormArray {
    return this.formInvoice.get('productsInvoice') as FormArray
  }



  addproductsInvoice() {
    let productsInvoice = this._fb.group({
      id:[null],
      idProduct: [null, [Validators.required]],
      description: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      unitValue: [null, [Validators.required]],
      idTax: [null, [Validators.required]],
      valueTax: [null, [Validators.required]],
      totalValue: [null, [Validators.required]],
      idCategory: [null, [Validators.required]],
    });
    this.productsInvoice.push(productsInvoice);
  }

  addTagPromise = (additionalData: { index?: number, dataAdicional: string }, name: string): Promise<any> => {
    console.log(name, 'name Etiqueta personalizada recibida');
    console.log(additionalData, 'aditional data Etiqueta personalizada recibida');
    const index = additionalData.index
    this.bsModalRefModal = this.modalService.show(AddProductInvoiceComponent, { backdrop: 'static', class: 'modal-lg p-1' });
    this.bsModalRefModal.content.title = 'Crear Producto';
    this.bsModalRefModal.content.name = name;
    this.bsModalRefModal.content.onClose.subscribe((result) => {
      console.log(result.data, 'data para pasar');
      if (result) {
        const idProduct = result.data.id
        console.log(idProduct, 'id prodcuto nuevo');
        this.loadProductsBack()
        const productoFactura = this.formInvoice.get('productsInvoice')['controls'][index]
        productoFactura.patchValue({ idProduct });
      }
    });
    return Promise.resolve(null);
  };



  loadProductInvoice(index: number, option: number) {
    const productsArray = this.formInvoice.value.productsInvoice
    const productoFactura = this.formInvoice.get('productsInvoice')['controls'][index]
    const idProduct = productoFactura.get('idProduct').value

    if (option == 1) {
      let existingProduct = productsArray.filter(point => point.idProduct == idProduct);
      if (existingProduct.length > 1) {
        productoFactura.patchValue({ idProduct: null });
        productoFactura.patchValue({ unitValue: null });
        productoFactura.patchValue({ idTax: null });
        productoFactura.patchValue({ idCategory: null });
        productoFactura.patchValue({ valueTax: null });
        productoFactura.patchValue({ totalValue: null });
        return this.toast.info('El producto ya esa seleccionada', ETitleMessages.INVOICE)
      }
    }

    if (idProduct != null) {
      const productoSeleccioando = this.products.find(item => item.id == idProduct)
      const idTax = option == 1 ? JSON.parse(productoSeleccioando.idTax) : productoFactura.get('idTax').value
      const unitValue = option == 1 ? productoSeleccioando.price : productoFactura.get('unitValue').value
      productoFactura.patchValue({ unitValue });
      productoFactura.patchValue({ idTax });
      productoFactura.patchValue({ idCategory: productoSeleccioando.idCategory });
      const valorImpuestos = this.taxes.filter(item => idTax.includes(item.id))
      const cantidad = productoFactura.get('amount').value
      let impuesto = 0
      if (cantidad > 0 && cantidad != null) {
        for (let i = 0; i < valorImpuestos.length; i++) {
          const element = valorImpuestos[i];
          impuesto += (unitValue * element.defaultRate) / 100
        }
        productoFactura.patchValue({ valueTax: (impuesto * cantidad) });
        productoFactura.patchValue({ totalValue: ((impuesto * cantidad) + (cantidad * unitValue)) });
      }
    } else {
      productoFactura.patchValue({ unitValue: null });
      productoFactura.patchValue({ idTax: null });
      productoFactura.patchValue({ idCategory: null });
      productoFactura.patchValue({ valueTax: null });
      productoFactura.patchValue({ totalValue: null });

    }
    this.calculateInvoiceTotals();

  }


  seletedTaxes(index) {
    const productoFactura = this.formInvoice.get('productsInvoice')['controls'][index]
    const idProduct = productoFactura.get('idProduct').value
    const cantidad = productoFactura.get('amount').value
    if (idProduct != null && cantidad != null) {
      const idTax = productoFactura.get('idTax').value
      const valorImpuestos = this.taxes.filter(item => idTax.includes(item.id))
      const unitValue = productoFactura.get('unitValue').value
      let impuesto = 0
      for (let i = 0; i < valorImpuestos.length; i++) {
        const element = valorImpuestos[i];
        impuesto += (unitValue * element.defaultRate) / 100
      }
      productoFactura.patchValue({ valueTax: (impuesto * cantidad) });
      productoFactura.patchValue({ totalValue: ((impuesto * cantidad) + (cantidad * unitValue)) });

    }
    this.calculateInvoiceTotals();
  }



  deleteProductInvoice(index) {
    (this.formInvoice.get('productsInvoice') as FormArray).removeAt(index);
    this.calculateInvoiceTotals();

  }


  calculateInvoiceTotals(): void {
    const productsInvoice = this.formInvoice.get('productsInvoice') as FormArray;

    let subTotalInvoice = 0;
    let taxesInvoice = 0;

    productsInvoice.controls.forEach(product => {
      const amount = product.get('amount').value || 0;
      const unitValue = product.get('unitValue').value || 0;
      const valueTax = product.get('valueTax').value || 0;

      subTotalInvoice += amount * unitValue;
      taxesInvoice += valueTax;
    });

    this.formInvoice.patchValue({
      subTotalInvoice: subTotalInvoice,
      taxesInvoice: taxesInvoice,
      totalInvoice: subTotalInvoice + taxesInvoice,
    });
  }






  /**
   * metodo para guardar los datos en el backend
   * @returns IGroup
   */
  saveData() {
    this.formInvoice.markAllAsTouched();
    if (this.formInvoice.invalid || this.productsInvoice.length < 1)  return this.toast.info('Debes llenar todos los datos requeridos del formulario', ETitleMessages.INVOICE)
    const rawValue: IInvoice = this.formInvoice.value;
    firstValueFrom(this.invoice ? this.incomeService.editInvoice(rawValue) : this.incomeService.newInvoice(rawValue)).then(_ => {
      this.toast.success(`Factura ${this.invoice ? 'modificada' : 'creada'} correctamente`, ETitleMessages.INVOICE)
      // this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
