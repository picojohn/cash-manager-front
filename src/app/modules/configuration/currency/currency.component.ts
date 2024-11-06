import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { ICountry, ICurrency, IGroup, ITax } from './interface/currency.interface';
import { CurrencyService } from './services/currency.service';
import { EditCurrencyComponent } from './components/edit-currency/edit-currency.component';
import { EditCountryComponent } from './components/edit-country/edit-country.component';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { EditTaxComponent } from './components/edit-tax/edit-tax.component';
import { EditGroupComponent } from './components/edit-group/edit-group.component';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
})
export class CurrencyComponent implements OnInit {

  private bsModalRef: BsModalRef;
  public selectedTab: number = 4;

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
  public nPaginasGroups = [5, 10, 20, 50, 100];
  public pageGroups: number = 1;
  public totalPaginasGroups= 5;
  public _buscadorGroups: string = '';


  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private currencyService: CurrencyService,
    private sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  selectTab(tabNumber: number) {
    this.selectedTab = tabNumber;
  }


  /**
   * carga inicial de datos
   */
  loadData() {
    firstValueFrom(this.currencyService.getCurrencys()).then(currencysBack => {
      this.currencys = currencysBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.currencyService.getCountries()).then(countriesBack => {
      this.countries = countriesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.currencyService.getTaxes()).then(taxesBack => {
      this.taxes = taxesBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

    firstValueFrom(this.currencyService.getGroups()).then(groupsBack => {
      this.groups = groupsBack;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });

  }

  newCurrency() {
    this.bsModalRef = this.modalService.show(EditCurrencyComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Moneda';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editCurrency(currency: ICurrency) {
    this.bsModalRef = this.modalService.show(EditCurrencyComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Moneda';
    this.bsModalRef.content.currency = currency;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  async deleteCurrency(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.currencyService.deleteCurrency(id)).then(i => {
        this.toast.success('Moneda eliminada correctamente', ETitleMessages.CURRENCY)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }

  numeroPaginasCurrency($event: any) {
    const { value } = $event.target;
    this.totalPaginasCurrency = value;
    this.pageCurrency = 1;
  }

  // Buscador filtro como tambien que siempre retorne a pagina 1

  set buscadorCurrency(value: string) {
    this._buscadorCurrency = value;
    this.pageCurrency = 1;
  }

  get buscadorCurrency(): string {
    return this._buscadorCurrency;
  }

  filterCurrencys() {
    if (!this.buscadorCurrency) {
      return this.currencys;
    }
    return this.currencys.filter((currency) =>
      currency.name.toLowerCase().includes(this.buscadorCurrency.toLowerCase())
    );
  }


  ///// counturies

  newCountry() {
    this.bsModalRef = this.modalService.show(EditCountryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Pais';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editCountry(country: ICountry) {
    this.bsModalRef = this.modalService.show(EditCountryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Pais';
    this.bsModalRef.content.country = country;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  async deleteCountry(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.currencyService.deleteCountry(id)).then(i => {
        this.toast.success('País eliminado correctamente', ETitleMessages.COUNTRY)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }


  numeroPaginasCountries($event: any) {
    const { value } = $event.target;
    this.totalPaginasCountries = value;
    this.pageCountries = 1;
  }

  set buscadorCountries(value: string) {
    this._buscadorCountries = value;
    this.pageCountries = 1;
  }

  get buscadorCountries(): string {
    return this._buscadorCountries;
  }

  filterCountries() {
    if (!this.buscadorCountries) {
      return this.countries;
    }
    return this.countries.filter((currency) =>
      currency.name.toLowerCase().includes(this.buscadorCountries.toLowerCase())
    );
  }


  // taxes

  newTax() {
    this.bsModalRef = this.modalService.show(EditTaxComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Impuesto';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editTax(tax: ITax) {
    this.bsModalRef = this.modalService.show(EditTaxComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Impuesto';
    this.bsModalRef.content.tax = tax;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  async deleteTax(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.currencyService.deleteTax(id)).then(i => {
        this.toast.success('Impuesto eliminado correctamente', ETitleMessages.TAX)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }


  numeroPaginasTaxes($event: any) {
    const { value } = $event.target;
    this.totalPaginasTaxes = value;
    this.pageTaxes = 1;
  }

  set buscadorTaxes(value: string) {
    this._buscadorTaxes = value;
    this.pageTaxes = 1;
  }

  get buscadorTaxes(): string {
    return this._buscadorTaxes;
  }

  filterTaxes() {
    if (!this.buscadorTaxes) {
      return this.taxes;
    }
    return this.taxes.filter((tax) =>
      tax.name.toLowerCase().includes(this.buscadorTaxes.toLowerCase())
    );
  }


  // Groups

  newGroup() {
    this.bsModalRef = this.modalService.show(EditGroupComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Grupo';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  editGroup(group: IGroup) {
    this.bsModalRef = this.modalService.show(EditGroupComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Editar Grupo';
    this.bsModalRef.content.group = group;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  async deleteGroup(id: number) {
    if (await this.sweetAlertService.alertDeleteMessage()) {
      firstValueFrom(this.currencyService.deleteGroup(id)).then(i => {
        this.toast.success('Grupo eliminado correctamente', ETitleMessages.GROUPS)
        this.loadData()
      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
      })

    }
  }


  numeroPaginasGroup($event: any) {
    const { value } = $event.target;
    this.totalPaginasGroups = value;
    this.pageGroups = 1;
  }

  set buscadorGroups(value: string) {
    this._buscadorGroups = value;
    this.pageGroups = 1;
  }

  get buscadorGroups(): string {
    return this._buscadorGroups;
  }

  filterGroups() {
    if (!this.buscadorGroups) {
      return this.groups;
    }
    return this.groups.filter((group) =>
      group.name.toLowerCase().includes(this.buscadorGroups.toLowerCase())
    );
  }


}
