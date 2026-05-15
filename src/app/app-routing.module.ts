import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/components/login/login.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { content } from './shared/routes/content-routes';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { QuickbooksCallbackComponent } from './authentication/components/quickbooks-callback/quickbooks-callback.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/authentication/login',
  },
  {
    path: 'gestiones',
    component: SidebarComponent,
    children: content,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'auth/quickbooks-callback',
    component: QuickbooksCallbackComponent,
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
