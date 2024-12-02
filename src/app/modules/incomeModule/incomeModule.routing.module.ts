import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeModuleComponent } from './incomeModule.component';
import { IncomeComponent } from './income/income.component';


const routes: Routes = [
  {
    path: '',
    component: IncomeModuleComponent,
    children: [

     {
       path: 'income',
       component: IncomeComponent,
     },
    //  {
    //    path: 'panel',
    //    component: PanelComponent,
    //  },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeModuleRoutingModule { }
