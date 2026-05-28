import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickbooksComponent } from './quickbooks.component';
import { EstadoComponent } from './estado/estado.component';
import { CustomersComponent } from './customers/customers.component';
import { ItemsComponent } from './items/items.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { AccountsComponent } from './accounts/accounts.component';
import { PaymentsComponent } from './payments/payments.component';
import { VendorsComponent } from './vendors/vendors.component';
import { BillsComponent } from './bills/bills.component';
import { BillPaymentsComponent } from './bill-payments/bill-payments.component';
import { TransfersComponent } from './transfers/transfers.component';

const routes: Routes = [
  {
    path: '',
    component: QuickbooksComponent,
    children: [
      { path: '', redirectTo: 'state', pathMatch: 'full' },
      { path: 'state', component: EstadoComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'bills', component: BillsComponent },
      { path: 'bill-payments', component: BillPaymentsComponent },
      { path: 'transfers', component: TransfersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickbooksRoutingModule {}
