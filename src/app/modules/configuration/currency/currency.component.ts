import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { ICurrency } from './interface/currency.interface';
import { CurrencyService } from './services/currency.service';
import { EditCurrencyComponent } from './edit-currency/edit-currency.component';
import { ICountry } from '../countries/interface/countries.interface';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
})
export class CurrencyComponent implements OnInit {
  private bsModalRef: BsModalRef;
  public currencys: Array<ICurrency> = [];

  // paginador
  public nPaginasCurrency = [5, 10, 20, 50, 100];
  public pageCurrency: number = 1;
  public totalPaginasCurrency = 5; // Establece el valor inicial en 5

  // buscador
  public _buscadorCurrency: string = '';

/////countries

public countries: Array<ICountry> = [];

public nPaginasCountries = [5, 10, 20, 50, 100];
public pageCountries: number = 1;
public totalPaginasCountries = 5; // Establece el valor inicial en 5

// buscador
public _buscadorCountries: string = '';





  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private currencyService: CurrencyService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * carga inicial de datos
   */
  loadData() {
    firstValueFrom(this.currencyService.getCurrencys()).then(currencysBack => {
      this.currencys = currencysBack;
      console.log(currencysBack);
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
    firstValueFrom(this.currencyService.getCountries()).then(countriesBack => {
      const result: Array<ICountry> = Object.values(countriesBack.reduce((acc, curr) => {
        if (!acc[curr.id]) {
          acc[curr.id] = {
            id: curr.id,
            name: curr.name,
            state: curr.state,
            language: curr.language,
            countryCode: curr.countryCode,
            idCurrencies: [],
            nameCurrencies: []
          };
        }
        if (!acc[curr.id].idCurrencies.includes(curr.idCurrency)) {
          acc[curr.id].idCurrencies.push(curr.idCurrency);
          acc[curr.id].nameCurrencies.push(' ' + curr.nameCurrency + ' - ' + curr.code);
        }
        return acc;
      }, {}));
      console.log(result);
      this.countries = result;
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


  /**
   * metodo del controlador de colaborador para cambiar el estdo de un colaborador
   * @param id
   */
  async statesCurrency(id): Promise<void> {
    // if (await this.sweetAlertService.alertStatesMessage()) {
    //   await firstValueFrom(this.cargosService.cambiarEstadosByid(id)).then(
    //     (_) => {
    //       this.toast.success('Estado cambiado correctamente', 'Cargo');
    //       this.loadData();
    //     },
    //     (err) => {
    //       const errorObject = this.errorService.showNotification(err);
    //       this.toast[errorObject.typeToast](
    //         errorObject.message,
    //         errorObject.typeMessage,
    //         { timeOut: errorObject.timeOut }
    //       );
    //     }
    //   );
    // }
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


  numeroPaginasCountries($event: any) {
    const { value } = $event.target;
    this.totalPaginasCountries = value;
    this.pageCountries = 1;
  }

  // Buscador filtro como tambien que siempre retorne a pagina 1

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


  // componentes para las pestañas en tablas si se quisira
  // selectedTab: number = 1;

  // selectTab(tabNumber: number) {
  //   this.selectedTab = tabNumber;
  // }

}
