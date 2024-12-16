import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeModuleRoutingModule } from './incomeModule.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { IncomeModuleComponent } from './incomeModule.component';
import { IncomeComponent } from './income/income.component';
import { EditInvoiceComponent } from './income/components/edit-invoice/edit-invoice.component';
import { IncomeService } from './income/services/invcome.service';
import { AddProductInvoiceComponent } from './income/components/add-product-invoice/add-product-invoice.component';




@NgModule({
  declarations: [
    IncomeModuleComponent,
    IncomeComponent,
    EditInvoiceComponent,
    AddProductInvoiceComponent,



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
    IncomeService,

  ]

})
export class IncomeModuleModule { }
