import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/modules/home/home.component';

export const content: Routes = [
  {
    path: '',
    component: HomeComponent,
    loadChildren: () => import('../../modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'configuration',
    loadChildren: () => import('../../modules/configuration/configuration.module').then(m => m.ConfigurationModule),
  },
  {
    path: 'quickbooks',
    loadChildren: () => import('../../modules/quickbooks/quickbooks.module').then(m => m.QuickbooksModule),
  },
  {
    path: 'cash-flow',
    loadChildren: () => import('../../modules/cash-flow/cash-flow.module').then(m => m.CashFlowModule),
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
