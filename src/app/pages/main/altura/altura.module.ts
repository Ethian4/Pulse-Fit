import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlturaPageRoutingModule } from './altura-routing.module';

import { AlturaPage } from './altura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlturaPageRoutingModule
  ],
  declarations: [AlturaPage]
})
export class AlturaPageModule {}
