import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importa aquí
import { IonicModule } from '@ionic/angular';

import { AlturaPageRoutingModule } from './altura-routing.module';

import { AlturaPage } from './altura.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, // Incluye este módulo,
    FormsModule,
    IonicModule,
    AlturaPageRoutingModule
  ],
  declarations: [AlturaPage]
})
export class AlturaPageModule {}
