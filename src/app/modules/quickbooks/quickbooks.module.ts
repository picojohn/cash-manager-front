import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickbooksRoutingModule } from './quickbooks.routing.module';
import { QuickbooksComponent } from './quickbooks.component';
import { EstadoComponent } from './estado/estado.component';
import { CustomersComponent } from './customers/customers.component';
import { EditCustomerComponent } from './customers/components/edit-customer/edit-customer.component';
import { ItemsComponent } from './items/items.component';
import { EditItemComponent } from './items/components/edit-item/edit-item.component';
import { AdjustStockComponent } from './items/components/adjust-stock/adjust-stock.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceDetailComponent } from './invoices/components/invoice-detail/invoice-detail.component';
import { EditInvoiceComponent } from './invoices/components/edit-invoice/edit-invoice.component';
import { AccountsComponent } from './accounts/accounts.component';

@NgModule({
  declarations: [
    QuickbooksComponent,
    EstadoComponent,
    CustomersComponent,
    EditCustomerComponent,
    ItemsComponent,
    EditItemComponent,
    AdjustStockComponent,
    InvoicesComponent,
    InvoiceDetailComponent,
    EditInvoiceComponent,
    AccountsComponent,
  ],
  imports: [
    CommonModule,
    QuickbooksRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    TranslateModule,
  ],
})
export class QuickbooksModule {}
