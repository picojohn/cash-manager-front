import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashFlowComponent } from './cash-flow.component';
import { ForecastComponent } from './forecast/forecast.component';

const routes: Routes = [
  {
    path: '',
    component: CashFlowComponent,
    children: [
      { path: '', redirectTo: 'forecast', pathMatch: 'full' },
      { path: 'forecast', component: ForecastComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashFlowRoutingModule {}
