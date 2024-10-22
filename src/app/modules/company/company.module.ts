import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompanyComponent } from './company.component';
import { cargosComponent } from './cargos/cargos.component';
import { CargosService } from './cargos/services/cargos.service';
import { EditarCargosComponent } from './cargos/editar-cargos/editar-cargos.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    CompanyComponent,
    cargosComponent,
    EditarCargosComponent,

  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  providers: [
    CargosService,

  ]

})
export class CompanyModule { }
