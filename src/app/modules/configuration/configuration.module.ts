import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigurationComponent } from './configuration.component';
import { CurrencyComponent } from './currency/currency.component';
import { EditCurrencyComponent } from './currency/components/edit-currency/edit-currency.component';
import { CurrencyService } from './currency/services/currency.service';
import { EditCountryComponent } from './currency/components/edit-country/edit-country.component';
import { ModulesSubComponent } from './modulesSub/modulesSub.component';
import { ModulesSubService } from './modulesSub/services/modulesSub.service';
import { EditModuleComponent } from './modulesSub/components/edit-module/edit-module.component';
import { EditSubModuleComponent } from './modulesSub/components/edit-subModule/edit-subModule.component';
import { EditTaxComponent } from './currency/components/edit-tax/edit-tax.component';
import { EditGroupComponent } from './currency/components/edit-group/edit-group.component';
import { EditTypeComponent } from './currency/components/edit-type/edit-type.component';



@NgModule({
  declarations: [
    ConfigurationComponent,
    CurrencyComponent,
    EditCurrencyComponent,
    EditCountryComponent,
    ModulesSubComponent,
    EditModuleComponent,
    EditSubModuleComponent,
    EditTaxComponent,
    EditGroupComponent,
    EditTypeComponent,


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
    ModulesSubService

  ]

})
export class ConfigurationModule { }
