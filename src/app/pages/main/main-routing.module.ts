import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentPageModule)
  },
  {
    path: 'classlist',
    loadChildren: () => import('./classlist/classlist.module').then(m => m.ClasslistPageModule)
  },
  {
    path: 'genero',
    loadChildren: () => import('./genero/genero.module').then( m => m.GeneroPageModule)
  },
  {
    path: 'edad',
    loadChildren: () => import('./edad/edad.module').then( m => m.EdadPageModule)
  },
  {
    path: 'peso',
    loadChildren: () => import('./peso/peso.module').then( m => m.PesoPageModule)
  },
  {
    path: 'altura',
    loadChildren: () => import('./altura/altura.module').then( m => m.AlturaPageModule)
  },
  {
    path: 'metas',
    loadChildren: () => import('./metas/metas.module').then( m => m.MetasPageModule)
  },
  {
    path: 'ready',
    loadChildren: () => import('./ready/ready.module').then( m => m.ReadyPageModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}

