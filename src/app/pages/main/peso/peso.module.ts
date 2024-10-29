import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importa aquí
import { IonicModule } from '@ionic/angular';

import { PesoPageRoutingModule } from './peso-routing.module';

import { PesoPage } from './peso.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, // Incluye este módulo,
    FormsModule,
    IonicModule,
    PesoPageRoutingModule
  ],
  declarations: [PesoPage]
})
export class PesoPageModule {}
