import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickbooksComponent } from './quickbooks.component';
import { EstadoComponent } from './estado/estado.component';
import { CustomersComponent } from './customers/customers.component';

const routes: Routes = [
  {
    path: '',
    component: QuickbooksComponent,
    children: [
      { path: '', redirectTo: 'state', pathMatch: 'full' },
      { path: 'state', component: EstadoComponent },
      { path: 'customers', component: CustomersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickbooksRoutingModule {}
