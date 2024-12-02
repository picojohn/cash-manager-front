import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeModuleRoutingModule } from './incomeModule.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { IncomeModuleComponent } from './incomeModule.component';
import { IncomeComponent } from './income/income.component';




@NgModule({
  declarations: [
    IncomeModuleComponent,
    IncomeComponent



  ],
  imports: [
    CommonModule,
    IncomeModuleRoutingModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  providers: [


  ]

})
export class IncomeModuleModule { }
