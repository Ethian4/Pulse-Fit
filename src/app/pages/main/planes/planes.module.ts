import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { PlanesPageRoutingModule } from './planes-routing.module';

import { PlanesPage } from './planes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanesPageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  declarations: [PlanesPage]
})
export class PlanesPageModule {}
