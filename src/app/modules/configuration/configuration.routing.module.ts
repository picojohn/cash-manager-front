import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { PanelComponent } from './panel/panel.component';
import { UsersComponent } from './users/users.component';
import { CompaniesComponent } from './companies/companies.component';
import { QuickbooksComponent } from './quickbooks/quickbooks.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
     {
       path: 'panel',
       component: PanelComponent,
     },
     {
       path: 'users',
       component: UsersComponent,
     },
     {
       path: 'companies',
       component: CompaniesComponent,
     },
     {
       path: 'quickbooks',
       component: QuickbooksComponent,
     },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
