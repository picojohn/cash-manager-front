// import { Component, OnInit } from '@angular/core';
// import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { ToastrService } from 'ngx-toastr';
// import { ErrorService } from 'src/app/shared/services/error.service';
// import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
// import { firstValueFrom } from 'rxjs';
// import { ICountry } from './interface/countries.interface';
// import { CountriesService } from './services/countries.service';
// import { EditCountryComponent } from '../currency/components/edit-country/edit-country.component';

// @Component({
//   selector: 'app-countries',
//   templateUrl: './countries.component.html',
//   styleUrls: ['./countries.component.css'],
// })
// export class CountriesComponent implements OnInit {
//   private bsModalRef: BsModalRef;
//   public countries: Array<ICountry> = [];

//   // paginador
//   public nPaginas = [5, 10, 20, 50, 100];
//   public page: number = 1;
//   public totalPaginas = 5; // Establece el valor inicial en 5

//   // buscador
//   public _buscador: string = '';

//   constructor(
//     private modalService: BsModalService,
//     public toast: ToastrService,
//     private errorService: ErrorService,
//     private countriesService: CountriesService
//     // private sweetAlertService: SweetAlertService
//   ) { }

//   ngOnInit(): void {
//     this.loadData();
//   }

//   /**
//    * carga inicial de datos
//    */
//   loadData() {
//     firstValueFrom(this.countriesService.getCountries()).then(countriesBack => {
//       const result: Array<ICountry> = Object.values(countriesBack.reduce((acc, curr) => {
//         if (!acc[curr.id]) {
//           acc[curr.id] = {
//             id: curr.id,
//             name: curr.name,
//             state: curr.state,
//             language: curr.language,
//             countryCode: curr.countryCode,
//             idCurrencies: [],
//             nameCurrencies: []
//           };
//         }
//         if (!acc[curr.id].idCurrencies.includes(curr.idCurrency)) {
//           acc[curr.id].idCurrencies.push(curr.idCurrency);
//           acc[curr.id].nameCurrencies.push(' ' + curr.nameCurrency + ' - ' + curr.code);
//         }
//         return acc;
//       }, {}));
//       this.countries = result;
//     }, err => {
//       const errorObject = this.errorService.showNotification(err);
//       this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
//     });
//   }

//   new() {
//     this.bsModalRef = this.modalService.show(EditCountryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
//     this.bsModalRef.content.title = 'Crear Pais';
//     this.bsModalRef.onHidden?.subscribe((_) => {
//       this.loadData();
//     });
//   }

//   edit(country: ICountry) {
//     this.bsModalRef = this.modalService.show(EditCountryComponent, { backdrop: 'static', class: 'modal-lg p-5', });
//     this.bsModalRef.content.title = 'Editar Pais';
//     this.bsModalRef.content.country = country;
//     this.bsModalRef.onHidden?.subscribe((_) => {
//       this.loadData();
//     });
//   }


//   /**
//    * metodo del controlador de colaborador para cambiar el estdo de un colaborador
//    * @param id
//    */
//   async states(id): Promise<void> {
//     // if (await this.sweetAlertService.alertStatesMessage()) {
//     //   await firstValueFrom(this.cargosService.cambiarEstadosByid(id)).then(
//     //     (_) => {
//     //       this.toast.success('Estado cambiado correctamente', 'Cargo');
//     //       this.loadData();
//     //     },
//     //     (err) => {
//     //       const errorObject = this.errorService.showNotification(err);
//     //       this.toast[errorObject.typeToast](
//     //         errorObject.message,
//     //         errorObject.typeMessage,
//     //         { timeOut: errorObject.timeOut }
//     //       );
//     //     }
//     //   );
//     // }
//   }

//   numeroPaginas($event: any) {
//     const { value } = $event.target;
//     this.totalPaginas = value;
//     this.page = 1;
//   }

//   // Buscador filtro como tambien que siempre retorne a pagina 1

//   set buscador(value: string) {
//     this._buscador = value;
//     this.page = 1;
//   }

//   get buscador(): string {
//     return this._buscador;
//   }

//   filterCountries() {
//     if (!this.buscador) {
//       return this.countries;
//     }
//     return this.countries.filter((currency) =>
//       currency.name.toLowerCase().includes(this.buscador.toLowerCase())
//     );
//   }

// }
