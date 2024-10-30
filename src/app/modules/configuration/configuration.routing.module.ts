import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { CurrencyComponent } from './currency/currency.component';
import { ModulesSubComponent } from './modulesSub/modulesSub.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [

     {
       path: 'currency',
       component: CurrencyComponent,
     },
     {
       path: 'modulesSub',
       component: ModulesSubComponent,
     },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
