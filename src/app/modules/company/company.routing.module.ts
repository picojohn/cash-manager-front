import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { cargosComponent } from './cargos/cargos.component';


const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [

     {
       path: 'cargos',
       component: cargosComponent,
     },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
