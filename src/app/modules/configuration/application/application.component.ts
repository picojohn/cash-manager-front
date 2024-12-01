import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { ICategory, ICountry, ICurrency, IGroup, IName, IPaymentMethod, ITax, IType, ITypesPayment } from './interface/application.interface';
import { ApplicationService } from './services/application.service';
import { EditCurrencyComponent } from './components/edit-currency/edit-currency.component';
import { EditCountryComponent } from './components/edit-country/edit-country.component';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { EditTaxComponent } from './components/edit-tax/edit-tax.component';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { constClassificationDate, constSeccionDate } from 'src/app/shared/data/const';
import { EditTypeComponent } from './components/edit-type/edit-type.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { EditPaymentMethodComponent } from './components/edit-paymentMethod/edit-paymentMethod.component';
import { EditTypesPaymentsComponent } from './components/edit-typesPayment/edit-typesPayments.component';
import { Router } from '@angular/router';
import { IPermisionValue, IPermissionAction, ITabsPermision } from 'src/app/shared/interface/permission.interface';
import { IRole } from '../panel/interface/panel.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent implements OnInit {

  private bsModalRef: BsModalRef;
  public selectedTab: number;

  //constantes para los datos
  public classifications: Array<IName> = constClassificationDate
  public seccions: Array<IName> = constSeccionDate


  // currencies
  public currencys: Array<ICurrency> = [];
  public nPaginasCurrency = [5, 10, 20, 50, 100];
  public pageCurrency: number = 1;
  public totalPaginasCurrency = 5;
  public _buscadorCurrency: string = '';

  //countries
  public countries: Array<ICountry> = [];
  public nPaginasCountries = [5, 10, 20, 50, 100];
  public pageCountries: number = 1;
  public totalPaginasCountries = 5;
  public _buscadorCountries: string = '';

  //Tqxes
  public taxes: Array<ITax> = [];
  public nPaginasTaxes = [5, 10, 20, 50, 100];
  public pageTaxes: number = 1;
  public totalPaginasTaxes = 5;
  public _buscadorTaxes: string = '';

  //Groups
  public groups: Array<IGroup> = [];
  public groupsSelected: Array<IGroup> = [];
  public nPaginasGroups = [5, 10, 20, 50, 100];
  public pageGroups: number = 1;
  public totalPaginasGroups = 5;
  public _buscadorGroups: string = '';
  public valueGroupsSelected = null;

  //Types
  public types: Array<IType> = [];
  public typesSelected: Array<IType> = [];
  public nPaginasTypes = [5, 10, 20, 50, 100];
  public pageTypes: number = 1;
  public totalPaginasTypes = 5;
  public _buscadorTypes: string = '';
  public valueTypesSelected = null;

  //Categories
  public categories: Array<ICategory> = [];
  public categoriesSelected: Array<ICategory> = [];
  public nPaginasCategories = [5, 10, 20, 50, 100];
  public pageCategories: number = 1;
  public totalPaginasCategories = 5;
  public _buscadorCategories: string = '';
  public valueCategoriesSelected = null;

  //PaymentMethods
  public paymentMethods: Array<IPaymentMethod> = [];
  public nPaginasPaymentMethods = [5, 10, 20, 50, 100];
  public pagePaymentMethods: number = 1;
  public totalPaginasPaymentMethods = 5;
  public _buscadorPaymentMethods: string = '';

  //TypesPayments
  public typesPayments: Array<ITypesPayment> = [];
  public typesPaymentsSelected: Array<ITypesPayment> = [];
  public nPaginasTypesPayments = [5, 10, 20, 50, 100];
  public pageTypesPayments: number = 1;
  public totalPaginasTypesPayments = 5;
  public _buscadorTypesPayments: string = '';
  public valueTypesPaymentsSelected = null;

// compañias
  public companies: Array<any> = []

  //permisos
  public permission: IPermissionAction;
  public permisionBoolean: IPermisionValue;
  public rolesUser: IRole;
  public pestanas: IPermissionAction;
  public selectedTabItem: ITabsPermision



  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private applicationService: ApplicationService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private permissionService: PermissionService,
  ) {
    this.pestanas = this.permissionService.getPermissions('application');
    this.selectTab(this.pestanas.applicationTabs[0].idApplicationTab, this.pestanas.applicationTabs[0])

    this.permisionBoolean = this.permissionService.permisionBoolean;
  }

  ngOnInit(): void {
    this.rolesUser = JSON.parse(localStorage.getItem('role'))
    this.loadData();
  }

  /**
   * mtodo permisos de la pestaña
   * @param tabNumber
   * @param item
   */
  selectTab(tabNumber: number, item) {
    this.selectedTab = tabNumber;
    this.selectedTabItem = item;
    this.permissionService.getPermisionValue(this.selectedTabItem.permission)
  }


  /**
   * carga inicial de datos
   */
  loadData() {
    firstValueFrom(this.applicationService.getCurrencys()).then(currencysBack => {
      this.currencys = currencysBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getCountries()).then(countriesBack => {
      this.countries = countriesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getTaxes()).then(taxesBack => {
      this.taxes = taxesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getGroups()).then(groupsBack => {
      this.groups = groupsBack;
      this.groupsSelected = groupsBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getTypes()).then(typessBack => {
      this.types = typessBack;
      this.typesSelected = typessBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getCategories()).then(categoriesBack => {
      this.categories = categoriesBack;
      this.categoriesSelected = categoriesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getCompanies()).then(companiesBack => {
      this.companies = companiesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getPaymentMethods()).then(paymentMethodsBack => {
      this.paymentMethods = paymentMethodsBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.applicationService.getTypesPayments()).then(typesPaymentsBack => {
      this.typesPayments = typesPaymentsBack;
      this.typesPaymentsSelected = typesPaymentsBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

  }

  /**
   * metodo para abrir el modal para crear la moneda
   */
  newCurrency() {
    this.bsModalRef = this.modalService.show(EditCurrencyComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Moneda';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para abrir el modal para editar la moneda
   * @param currency
   */
  editCurrency(currency: ICurrency) {
    this.bsModalRef = this.modalService.show(EditCurrencyComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Moneda';
    this.bsModalRef.content.currency = currency;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para eliminar la moneda
   * @param id
   */
  async deleteCurrency(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deleteCurrency(id)).then(i => {
        this.toast.success('Moneda eliminada correctamente', ETitleMessages.CURRENCY)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }

  /**
   * metodo para el numero de paginas para la pestaña de monedas
   * @param $event
   */
  numeroPaginasCurrency($event: any) {
    const { value } = $event.target;
    this.totalPaginasCurrency = value;
    this.pageCurrency = 1;
  }

  /**
   * metodo del set del Buscador filtro como tambien que siempre retorne a pagina 1
   */
  set buscadorCurrency(value: string) {
    this._buscadorCurrency = value;
    this.pageCurrency = 1;
  }

  /**
   * metodo set del buscador para el buscador de moneda
   */
  get buscadorCurrency(): string {
    return this._buscadorCurrency;
  }

  /**
   * metodo del filtro de moneda para el buscador y mostrar el resultado en la pestaña
   * @returns currencys
   */
  filterCurrencys() {
    if (!this.buscadorCurrency) {
      return this.currencys;
    }
    return this.currencys.filter((currency) =>
      currency.name.toLowerCase().includes(this.buscadorCurrency.toLowerCase())
    );
  }


  ///// counturies

  /**
   * metodo abrir el modal para crear un nuevo pais
   */
  newCountry() {
    this.bsModalRef = this.modalService.show(EditCountryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Pais';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para abrir el modal para editar el pais
   * @param country
   */
  editCountry(country: ICountry) {
    this.bsModalRef = this.modalService.show(EditCountryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Pais';
    this.bsModalRef.content.country = country;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para eliminar un pais
   * @param id
   */
  async deleteCountry(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deleteCountry(id)).then(i => {
        this.toast.success('País eliminado correctamente', ETitleMessages.COUNTRY)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }

  /**
   * metodo para numero de paginas de pais
   * @param $event
   */
  numeroPaginasCountries($event: any) {
    const { value } = $event.target;
    this.totalPaginasCountries = value;
    this.pageCountries = 1;
  }

  /**
   * metodo del buscador del set para paises
   */
  set buscadorCountries(value: string) {
    this._buscadorCountries = value;
    this.pageCountries = 1;
  }

  /**
   * metodo del get del buscador para paises
   */
  get buscadorCountries(): string {
    return this._buscadorCountries;
  }

  /**
   * metodo del filtro de paises que muestra en la vista
   * @returns countries
   */
  filterCountries() {
    if (!this.buscadorCountries) {
      return this.countries;
    }
    return this.countries.filter((currency) =>
      currency.name.toLowerCase().includes(this.buscadorCountries.toLowerCase())
    );
  }


  // taxes

  /**
   * metodo para abrir el modal para crear un impuesto
   */
  newTax() {
    this.bsModalRef = this.modalService.show(EditTaxComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Impuesto';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para abrir el modal para editar el impuesto
   * @param tax
   */
  editTax(tax: ITax) {
    this.bsModalRef = this.modalService.show(EditTaxComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Impuesto';
    this.bsModalRef.content.tax = tax;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para eliminar un impuesto
   * @param id
   */
  async deleteTax(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deleteTax(id)).then(i => {
        this.toast.success('Impuesto eliminado correctamente', ETitleMessages.TAX)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }

  /**
   * metodo de numero de paginas de impuestos
   * @param $event
   */
  numeroPaginasTaxes($event: any) {
    const { value } = $event.target;
    this.totalPaginasTaxes = value;
    this.pageTaxes = 1;
  }

  /**
   * metodo set de buscador de impuestos
   */
  set buscadorTaxes(value: string) {
    this._buscadorTaxes = value;
    this.pageTaxes = 1;
  }

  /**
   * metodo get del buscador de impuestos
   */
  get buscadorTaxes(): string {
    return this._buscadorTaxes;
  }

  /**
   * metodo para el filtro de impuestos para mostrar en la pestaña
   * @returns taxes
   */
  filterTaxes() {
    if (!this.buscadorTaxes) {
      return this.taxes;
    }
    return this.taxes.filter((tax) =>
      tax.name.toLowerCase().includes(this.buscadorTaxes.toLowerCase())
    );
  }


  // Groups

  /**
   * metodo que abre el modal para la creacion de un grupo
   */
  newGroup() {
    this.bsModalRef = this.modalService.show(EditGroupComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Grupo';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo que abre el modal para editar un grupo
   * @param group
   */
  editGroup(group: IGroup) {
    this.bsModalRef = this.modalService.show(EditGroupComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Grupo';
    this.bsModalRef.content.group = group;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para elimiar un grupo
   * @param id
   */
  async deleteGroup(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deleteGroup(id)).then(i => {
        this.toast.success('Grupo eliminado correctamente', ETitleMessages.GROUPS)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }

  /**
   * metodo para colocar el nombre de la empresa por el id
   * @param id
   * @returns company.name
   */
  getCompanyName(id: number) {
    let company = this.companies.find(i => i.id == id)?.name
    return company ? company : '- 0 -'
  }

  /**
   * metodo que filtra la empresa esi el usuario no es administrador
   */
  selectedGroup() {
    if (this.valueGroupsSelected !== null) {
      this.groups = this.groupsSelected.filter(i => i.idCompany == this.valueGroupsSelected)
      this.pageGroups = 1
    } else {
      this.groups = this.groupsSelected
    }
  }

  /**
   * metodo para el nuemto de paginas del grupo
   * @param $event
   */
  numeroPaginasGroup($event: any) {
    const { value } = $event.target;
    this.totalPaginasGroups = value;
    this.pageGroups = 1;
  }

  /**
   * metodo set del buscador de grupos
   */
  set buscadorGroups(value: string) {
    this._buscadorGroups = value;
    this.pageGroups = 1;
  }

  /**
   * metodo get del busccador de grupos
   */
  get buscadorGroups(): string {
    return this._buscadorGroups;
  }

  /**
   * metodo de filtro del grupos que muestra los resultados en la pestaña
   * @returns groups
   */
  filterGroups() {
    if (!this.buscadorGroups) {
      return this.groups;
    }
    return this.groups.filter((group) =>
      group.name.toLowerCase().includes(this.buscadorGroups.toLowerCase())
    );
  }

  // Types
/**
 * metodo para abrir el modal para crear un nuevo tipo
 */
  newType() {
    this.bsModalRef = this.modalService.show(EditTypeComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Tipo';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para abrir el modal para editar un tipo
   * @param type
   */
  editType(type: IType) {
    this.bsModalRef = this.modalService.show(EditTypeComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Tipo';
    this.bsModalRef.content.type = type;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para eliminar un tipo
   * @param id
   */
  async deleteType(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deleteType(id)).then(i => {
        this.toast.success('Tipo eliminado correctamente', ETitleMessages.TYPES)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }

  /**
   * metodo para seleccionar el tipo para filtrar por empresa si no es administrador
   */
  selectedTypes() {
    if (this.valueTypesSelected !== null) {
      this.types = this.typesSelected.filter(i => i.idCompany == this.valueTypesSelected)
      this.pageTypes = 1
    } else {
      this.types = this.typesSelected
    }
  }

  /**
   * metodo del numero de paginas de los tipos
   * @param $event
   */
  numeroPaginasTypes($event: any) {
    const { value } = $event.target;
    this.totalPaginasTypes = value;
    this.pageTypes = 1;
  }

  /**
   * metodo set del buscador de tipos
   */
  set buscadorTypes(value: string) {
    this._buscadorTypes = value;
    this.pageTypes = 1;
  }

  /**
   * metodo get del buscador de tipos
   */
  get buscadorTypes(): string {
    return this._buscadorTypes;
  }

  /**
   * metodo del filtro de tipos que muestra los resultados en la pestaña
   * @returns types
   */
  filterTypes() {
    if (!this.buscadorTypes) {
      return this.types;
    }
    return this.types.filter((type) =>
      type.name.toLowerCase().includes(this.buscadorTypes.toLowerCase())
    );
  }



  // Categories
/**
 * metodo que abre el modal para crear una categoria
 */
  newCategory() {
    this.bsModalRef = this.modalService.show(EditCategoryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Categoría';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo que abre el mndal para editar una categoria
   * @param category
   */
  editCategory(category: ICategory) {
    this.bsModalRef = this.modalService.show(EditCategoryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Categoría';
    this.bsModalRef.content.category = category;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para eliminar una categoria por id
   * @param id
   */
  async deleteCategory(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deleteCategory(id)).then(i => {
        this.toast.success('Cuenta Contable eliminada correctamente', ETitleMessages.CATEGORIES)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })
    }
  }

  /**
   * metodo para cambiar el estado de una categoria
   * @param id
   */
  async statesCategory(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.applicationService.cambiarEstadosByidCategory(id)).then(_ => {
        this.toast.success('Estado cambiado correctamente', ETitleMessages.CATEGORIES);
        this.loadData();
      },
        (err) => {
          const errorObject = this.errorService.showNotification(err);
          this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
        }
      );
    }
  }

  /**
   * metodo para tomar el nombre de la constante de clasificacion
   * @param id
   * @returns classification.name
   */
  getClassificationName(id: number) {
    const itemClassification = this.classifications.find(i => i.id === id)?.name
    return itemClassification ? itemClassification : '- 0 -'
  }

  /**
   * metodo para filtrar las empresas de la categoria si no se es administrador
   */
  selectedCategories() {
    if (this.valueCategoriesSelected !== null) {
      this.categories = this.categoriesSelected.filter(i => i.idCompany == this.valueCategoriesSelected)
      this.pageCategories = 1
    } else {
      this.categories = this.categoriesSelected
    }
  }

/**
 * metodo para seleccionar el tipo de nombre por id
 * @param id
 * @returns
 */
  getTypeName(id: number) {
    const itemType = this.typesSelected.find(i => i.id === id)?.name
    return itemType ? itemType : '- 0 -'
  }

  /**
   * metodo para mostrar el nombre del grupo por id
   * @param id
   * @returns group.name
   */
  getGroupName(id: number) {
    const itemGroup = this.groupsSelected.find(i => i.id === id)?.name
    return itemGroup ? itemGroup : '- 0 -'
  }

/**
 * metodo para mostrar el nombre de la constante de seccion por el id
 * @param id
 * @returns seccion.name
 */
  getSeccionName(id: number) {
    const itemSeccion = this.seccions.find(i => i.id === id)?.name
    return itemSeccion ? itemSeccion : '- 0 -'
  }

/**
 * metodo para el numero de paginas para las categorias
 * @param $event
 */
  numeroPaginasCategories($event: any) {
    const { value } = $event.target;
    this.totalPaginasCategories = value;
    this.pageCategories = 1;
  }

  /**
   * metodo set del buscador de categorias
   */
  set buscadorCategories(value: string) {
    this._buscadorCategories = value;
    this.pageCategories = 1;
  }

  /**
   * metodo get del buscador de categorias
   */
  get buscadorCategories(): string {
    return this._buscadorCategories;
  }

  /**
   * metodo del filtro para las categorias que muestra en el modal
   * @returns categories
   */
  filterCategories() {
    if (!this.buscadorCategories) {
      return this.categories;
    }
    return this.categories.filter((category) =>
      category.category.toLowerCase().includes(this.buscadorCategories.toLowerCase())
    );
  }


  // PaymentMethod // forma de pago

  /**
   * metodo para abrir el modal para crear una forma de pago
   */
  newPaymentMethod() {
    this.bsModalRef = this.modalService.show(EditPaymentMethodComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear forma de pago';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para abrir el modal para editar una forma de pago
   * @param paymentMethod
   */
  editPaymentMethod(paymentMethod: IPaymentMethod) {
    this.bsModalRef = this.modalService.show(EditPaymentMethodComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar forma de pago';
    this.bsModalRef.content.paymentMethod = paymentMethod;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * mtodo para eliminar un metodo de pago
   * @param id
   */
  async deletePaymentMethod(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deletePaymentMethod(id)).then(i => {
        this.toast.success('Forma de pago eliminada correctamente', ETitleMessages.PAYMENTMETHOD)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })
    }
  }

/**
 * metodo del numero de paginas de metodos de pago
 * @param $event
 */
  numeroPaginasPaymentMethods($event: any) {
    const { value } = $event.target;
    this.totalPaginasPaymentMethods = value;
    this.pagePaymentMethods = 1;
  }

  /**
   * metodo set del buscador de metodo del pago
   */
  set buscadorPaymentMethods(value: string) {
    this._buscadorPaymentMethods = value;
    this.pagePaymentMethods = 1;
  }

  /**
   * metodo get del buscador de metodo de pago
   */
  get buscadorPaymentMethods(): string {
    return this._buscadorPaymentMethods;
  }

  /**
   * metodo del filtro de metodo de pago para mostrar en la pestaña
   * @returns paymentMethods
   */
  filterPaymentMethods() {
    if (!this.buscadorPaymentMethods) {
      return this.paymentMethods;
    }
    return this.paymentMethods.filter((paymentMethod) =>
      paymentMethod.name.toLowerCase().includes(this.buscadorPaymentMethods.toLowerCase())
    );
  }

  // medio de pago

  /**
   * metod para abrir el modal para crear un medio de pago
   */
  newTypesPayment() {
    this.bsModalRef = this.modalService.show(EditTypesPaymentsComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Medio de pago';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para abrir el modal para editar un medio de pago
   * @param typesPayment
   */
  editTypesPayment(typesPayment: ITypesPayment) {
    this.bsModalRef = this.modalService.show(EditTypesPaymentsComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Medio de pago';
    this.bsModalRef.content.typesPayment = typesPayment;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo para borrar un medio de pago
   * @param id
   */
  async deleteTypesPayment(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.applicationService.deleteTypesPayment(id)).then(i => {
        this.toast.success('Medio de Pago eliminado correctamente', ETitleMessages.TYPESPAYMENTS)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }

  /**
   *  metodo para filtrar por nombre de empresaa si no es administrador
   */
  selectedTypesPayment() {
    if (this.valueTypesPaymentsSelected !== null) {
      this.typesPayments = this.typesPaymentsSelected.filter(i => i.idCompany == this.valueTypesPaymentsSelected)
      this.pageTypesPayments = 1
    } else {
      this.typesPayments = this.typesPaymentsSelected
    }
  }

  /**
   * metodo de numero de paginas de medio de pagos retorna en la pagina 1
   * @param $event
   */
  numeroPaginasTypesPayment($event: any) {
    const { value } = $event.target;
    this.totalPaginasTypesPayments = value;
    this.pageTypesPayments = 1;
  }

  /**
   * metodo set del buscador de medio de pago
   */
  set buscadorTypesPayments(value: string) {
    this._buscadorTypesPayments = value;
    this.pageTypesPayments = 1;
  }

  /**
   * metodo get del buscador de medio de pago
   */
  get buscadorTypesPayments(): string {
    return this._buscadorTypesPayments;
  }

  /**
   * metodo del filtro del medio de pago que retorna la data en la vista
   * @returns typesPayments
   */
  filterTypesPayments() {
    if (!this.buscadorTypesPayments) {
      return this.typesPayments;
    }
    return this.typesPayments.filter((type) =>
      type.name.toLowerCase().includes(this.buscadorTypesPayments.toLowerCase())
    );
  }





}
