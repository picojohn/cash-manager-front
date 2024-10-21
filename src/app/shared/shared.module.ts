import { NgModule } from '@angular/core';
//import { SweetAlertService } from "./services/sweetAlert.service";
import { ErrorService } from './services/error.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { PermissionService } from './services/permission.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [
   SidebarComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    //FormsModule,
    // ReactiveFormsModule,
    // ToastrModule.forRoot({
    //   timeOut: 3000,
    //   preventDuplicates: true,
    //   closeButton: false,
    //   progressBar: true
    // })

  ],
  exports: [

  ],
  providers: [
     ErrorService,
    //  SweetAlertService,
    // PermissionService,


  ]
})
export class SharedModule { }

