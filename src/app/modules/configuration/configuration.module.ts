import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigurationComponent } from './configuration.component';
import { ApplicationComponent } from './application/application.component';
import { EditCurrencyComponent } from './application/components/edit-currency/edit-currency.component';
import { ApplicationService } from './application/services/application.service';
import { EditCountryComponent } from './application/components/edit-country/edit-country.component';
import { PanelComponent } from './panel/panel.component';
import { PanelService } from './panel/services/panel.service';
import { EditModuleComponent } from './panel/components/edit-module/edit-module.component';
import { EditSubModuleComponent } from './panel/components/edit-subModule/edit-subModule.component';
import { EditTaxComponent } from './application/components/edit-tax/edit-tax.component';
import { EditGroupComponent } from './application/components/edit-group/edit-group.component';
import { EditTypeComponent } from './application/components/edit-type/edit-type.component';
import { EditCategoryComponent } from './application/components/edit-category/edit-category.component';
import { EditPaymentMethodComponent } from './application/components/edit-paymentMethod/edit-paymentMethod.component';
import { EditTypesPaymentsComponent } from './application/components/edit-typesPayment/edit-typesPayments.component';
import { EditApplicationTabComponent } from './panel/components/edit-applicationTab/edit-applicationTab.component';
import { EditRoleComponent } from './panel/components/edit-role/edit-role.component';
import { EditMenuPermissionsComponent } from './panel/components/edit-menu-permissions/edit-menu-permissions.component';



@NgModule({
  declarations: [
    ConfigurationComponent,
    ApplicationComponent,
    EditCurrencyComponent,
    EditCountryComponent,
    PanelComponent,
    EditModuleComponent,
    EditSubModuleComponent,
    EditTaxComponent,
    EditGroupComponent,
    EditTypeComponent,
    EditCategoryComponent,
    EditPaymentMethodComponent,
    EditTypesPaymentsComponent,
    EditApplicationTabComponent,
    EditRoleComponent,
    EditMenuPermissionsComponent,


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
    PanelService

  ]

})
export class ConfigurationModule { }
