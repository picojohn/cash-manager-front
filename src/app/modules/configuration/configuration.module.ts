import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigurationComponent } from './configuration.component';
import { CurrencyComponent } from './currency/currency.component';
import { EditCurrencyComponent } from './currency/edit-currency/edit-currency.component';
import { CurrencyService } from './currency/services/currency.service';
import { CountriesComponent } from './countries/countries.component';
import { CountriesService } from './countries/services/countries.service';
import { EditCountryComponent } from './countries/edit-country/edit-country.component';
import { ModulesSubComponent } from './modulesSub/modulesSub.component';
import { ModulesSubService } from './modulesSub/services/modulesSub.service';



@NgModule({
  declarations: [
    ConfigurationComponent,
    CurrencyComponent,
    EditCurrencyComponent,
    CountriesComponent,
    EditCountryComponent,
    ModulesSubComponent,

  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  providers: [
    CurrencyService,
    CountriesService,
    ModulesSubService

  ]

})
export class ConfigurationModule { }
