import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { ICurrency } from './interface/currency.interface';
import { CurrencyService } from './services/currency.service';
import { EditCurrencyComponent } from './edit-currency/edit-currency.component';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
})
export class CurrencyComponent implements OnInit {
  private bsModalRef: BsModalRef;
  public currencys: Array<ICurrency> = [];

  // paginador
  public nPaginas = [5, 10, 20, 50, 100];
  public page: number = 1;
  public totalPaginas = 5; // Establece el valor inicial en 5

  // buscador
  public _buscador: string = '';

  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private currencyService: CurrencyService,
    // private sweetAlertService: SweetAlertService
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
    }
    );
  }

  new() {
    this.bsModalRef = this.modalService.show(EditCurrencyComponent, { backdrop: 'static', class: 'modal-lg p-5', });
    this.bsModalRef.content.title = 'Crear Moneda';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  edit(currency: ICurrency) {
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
  async states(id): Promise<void> {
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

  numeroPaginas($event: any) {
    const { value } = $event.target;
    this.totalPaginas = value;
    this.page = 1;
  }

  // Buscador filtro como tambien que siempre retorne a pagina 1

  set buscador(value: string) {
    this._buscador = value;
    this.page = 1;
  }

  get buscador(): string {
    return this._buscador;
  }

  filterCurrencys() {
    if (!this.buscador) {
      return this.currencys;
    }
    return this.currencys.filter((currency) =>
      currency.name.toLowerCase().includes(this.buscador.toLowerCase())
    );
  }

}
