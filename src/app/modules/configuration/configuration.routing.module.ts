import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { ApplicationComponent } from './application/application.component';
import { ModulesSubComponent } from './modulesSub/modulesSub.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [

     {
       path: 'application',
       component: ApplicationComponent,
     },
     {
       path: 'modulesSub',
       component: ModulesSubComponent,
     },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
