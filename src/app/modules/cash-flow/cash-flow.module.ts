import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CashFlowRoutingModule } from './cash-flow.routing.module';
import { CashFlowComponent } from './cash-flow.component';
import { ForecastComponent } from './forecast/forecast.component';

@NgModule({
  declarations: [CashFlowComponent, ForecastComponent],
  imports: [
    CommonModule,
    CashFlowRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule,
  ],
})
export class CashFlowModule {}
