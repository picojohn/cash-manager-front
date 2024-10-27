import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from "./authentication.routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from "./service/authentication.service";
import { HttpClientModule } from "@angular/common/http";
import { AuthenticationComponent } from './authentication.component';
// import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    // NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],

  declarations: [
    LoginComponent,
    AuthenticationComponent,
    RecoverPasswordComponent,
  ],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
