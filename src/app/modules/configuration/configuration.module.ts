import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigurationComponent } from './configuration.component';
import { PanelComponent } from './panel/panel.component';
import { PanelService } from './panel/services/panel.service';
import { EditModuleComponent } from './panel/components/edit-module/edit-module.component';
import { EditSubModuleComponent } from './panel/components/edit-subModule/edit-subModule.component';
import { EditRoleComponent } from './panel/components/edit-role/edit-role.component';
import { EditMenuPermissionsComponent } from './panel/components/edit-menu-permissions/edit-menu-permissions.component';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './users/components/edit-user/edit-user.component';
import { CompaniesComponent } from './companies/companies.component';
import { EditCompanyComponent } from './companies/components/edit-company/edit-company.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    PanelComponent,
    EditModuleComponent,
    EditSubModuleComponent,
    EditRoleComponent,
    EditMenuPermissionsComponent,
    UsersComponent,
    EditUserComponent,
    CompaniesComponent,
    EditCompanyComponent,
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
    PanelService
  ]
})
export class ConfigurationModule { }
