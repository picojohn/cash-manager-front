import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickbooksRoutingModule } from './quickbooks.routing.module';
import { QuickbooksComponent } from './quickbooks.component';
import { EstadoComponent } from './estado/estado.component';
import { CustomersComponent } from './customers/customers.component';
import { EditCustomerComponent } from './customers/components/edit-customer/edit-customer.component';

@NgModule({
  declarations: [QuickbooksComponent, EstadoComponent, CustomersComponent, EditCustomerComponent],
  imports: [
    CommonModule,
    QuickbooksRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TranslateModule,
  ],
})
export class QuickbooksModule {}
