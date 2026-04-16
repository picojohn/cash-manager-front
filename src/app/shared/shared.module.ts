import { NgModule } from '@angular/core';
import { ErrorService } from './services/error.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PermissionService } from './services/permission.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChangePasswordComponent } from './sidebar/change-password/change-password.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';
import { ProfileComponent } from './sidebar/profile/profile.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
   SidebarComponent,
   ChangePasswordComponent,
   SettingsPanelComponent,
   ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    SettingsPanelComponent,
    TranslateModule,
  ],
  providers: [
     ErrorService,
     PermissionService,
  ]
})
export class SharedModule { }
