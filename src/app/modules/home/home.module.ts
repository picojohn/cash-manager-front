import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioRouterModule } from './home.routing.module';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    InicioRouterModule,
    FormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
