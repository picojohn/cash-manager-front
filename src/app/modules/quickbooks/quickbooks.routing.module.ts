import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickbooksComponent } from './quickbooks.component';
import { EstadoComponent } from './estado/estado.component';
import { CustomersComponent } from './customers/customers.component';
import { ItemsComponent } from './items/items.component';
import { InvoicesComponent } from './invoices/invoices.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickbooksRoutingModule {}
