import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlturaPage } from './altura.page';

const routes: Routes = [
  {
    path: '',
    component: AlturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlturaPageRoutingModule {}
