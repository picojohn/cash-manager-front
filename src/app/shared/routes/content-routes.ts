import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/modules/home/home.component';
// import { HomeComponent } from '../../modules/home/home.component';
//import { AdminGuard } from 'src/app/authentication/guard/admin.guard';
export const content: Routes = [
  {
    path: '',
    component: HomeComponent,
    loadChildren: () => import('../../modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'empresa',
    loadChildren: () => import('../../modules/company/company.module').then(m => m.CompanyModule),
  //  canActivate: [AdminGuard]
  },
 

  {
    path: '',
    redirectTo: '/gestiones/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/gestiones/home',
    pathMatch: 'full'
  }
];
