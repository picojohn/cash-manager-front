import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
     {
       path: 'panel',
       component: PanelComponent,
     },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
