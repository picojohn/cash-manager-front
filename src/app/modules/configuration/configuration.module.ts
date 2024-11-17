import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigurationComponent } from './configuration.component';
import { ApplicationComponent } from './application/application.component';
import { EditCurrencyComponent } from './application/components/edit-currency/edit-currency.component';
import { ApplicationService } from './application/services/application.service';
import { EditCountryComponent } from './application/components/edit-country/edit-country.component';
import { ModulesSubComponent } from './modulesSub/modulesSub.component';
import { ModulesSubService } from './modulesSub/services/modulesSub.service';
import { EditModuleComponent } from './modulesSub/components/edit-module/edit-module.component';
import { EditSubModuleComponent } from './modulesSub/components/edit-subModule/edit-subModule.component';
import { EditTaxComponent } from './application/components/edit-tax/edit-tax.component';
import { EditGroupComponent } from './application/components/edit-group/edit-group.component';
import { EditTypeComponent } from './application/components/edit-type/edit-type.component';
import { EditCategoryComponent } from './application/components/edit-category/edit-category.component';
import { EditPaymentMethodComponent } from './application/components/edit-paymentMethod/edit-paymentMethod.component';
import { EditTypesPaymentsComponent } from './application/components/edit-typesPayment/edit-typesPayments.component';



@NgModule({
  declarations: [
    ConfigurationComponent,
    ApplicationComponent,
    EditCurrencyComponent,
    EditCountryComponent,
    ModulesSubComponent,
    EditModuleComponent,
    EditSubModuleComponent,
    EditTaxComponent,
    EditGroupComponent,
    EditTypeComponent,
    EditCategoryComponent,
    EditPaymentMethodComponent,
    EditTypesPaymentsComponent,


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
    ApplicationService,
    ModulesSubService

  ]

})
export class ConfigurationModule { }
