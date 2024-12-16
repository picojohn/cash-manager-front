import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom, Subject } from 'rxjs';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';
import { ICategory, ICurrency, IName, ITax } from 'src/app/modules/configuration/application/interface/application.interface';
import { constClienteCliente, constConditions, constEmpresasClientes, constMonths, constProductService, constProyecto, constUnidadNegocio } from 'src/app/shared/data/const';
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

  public years: number[] = [];




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

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 30; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
    console.log(this.years);

    firstValueFrom(this.incomeService.getCurrencys()).then(currencysItem => {
      console.log(currencysItem);
      this.currencies = currencysItem;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

    firstValueFrom(this.incomeService.getProducts()).then(productsItem => {
      console.log(productsItem);
      this.products = productsItem;
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
      productsInvoice: new FormArray([]),
    })
  }

  get productsInvoice(): FormArray {
    return this.formInvoice.get('productsInvoice') as FormArray
  }



  addproductsInvoice() {
    let productsInvoice = this._fb.group({
      idProduct: [null, [Validators.required]],
      description: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      unitValue: [null, [Validators.required]],
      idTax: [null, [Validators.required]],
      valueTax: [null, [Validators.required]],
      idCategory: [null, [Validators.required]],


    });
    this.productsInvoice.push(productsInvoice);
  }

  addTagPromise = (additionalData: { index?: number, dataAdicional: string }, name: string): Promise<any> => {
    console.log(name, 'name Etiqueta personalizada recibida');
    console.log(additionalData, 'aditional data Etiqueta personalizada recibida');
    this.bsModalRefModal = this.modalService.show(AddProductInvoiceComponent, { backdrop: 'static', class: 'modal-lg p-5' });
    return Promise.resolve(null);
};
  // addTagPromise(name: any, params: { index: number, dataAdicional: string }) {
  //   console.log('Etiqueta agregada:', name);
  //   console.log('Índice:', params.index);
  //   console.log('Datos adicionales:', params.dataAdicional);
  // }


  openModal(name: string) {
    console.log('Abriendo modal para:', name);
  }





  addCustomTag(newProductName) {
    console.log('Etiqueta personalizada agregada:', newProductName);

    this.bsModalRefModal = this.modalService.show(AddProductInvoiceComponent, { backdrop: 'static', class: 'modal-lg p-5', });


    // return { id: null, name: newProductName }; // También agrega el producto al select
  }






  onSelectOpen() {
    console.log('on select open');

    // Cargar todos los productos cuando se abre el select
    // this.loadProducts();
  }

  onProductSelect() {
    console.log('on product selec');

    // Lógica adicional si es necesario cuando se selecciona un producto
  }



  openNewProductModal(productName?: string) {
    console.log('abril nuevo moda');

    // Prellenar nombre si viene de búsqueda
    // if (productName) {
    //   this.newProduct.name = productName;
    // }

    // this.modalRef = this.modalService.show(this.newProductModal);
  }



  // Método para agregar tag/producto
  addProductTag = (term: string) => {
    this.openNewProductModal(term);
    return null;
  }













  /**
   * metodo para guardar los datos en el backend
   * @returns IGroup
   */
  saveData() {
    this.formInvoice.markAllAsTouched();
    // if (this.formGroup.invalid) return this.toast.info('Debes llenar todos los datos requeridos del formulario', ETitleMessages.GROUPS)
    // const rawValue: IGroup = this.formGroup.value;
    // firstValueFrom(this.group ? this.applicationService.editGroup(rawValue) : this.applicationService.newGroup(rawValue)).then(_ => {
    //   this.toast.success(`Grupo ${this.group ? 'modificado' : 'creado'} correctamente`, ETitleMessages.GROUPS)
    //   this.bsModalRef.hide()
    // }, err => {
    //   const errorObject = this.errorService.showNotification(err);
    //   this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    // })

  }



}
