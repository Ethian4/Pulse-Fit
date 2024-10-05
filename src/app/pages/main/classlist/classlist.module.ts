import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClasslistPageRoutingModule } from './classlist-routing.module';

import { ClasslistPage } from './classlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClasslistPageRoutingModule
  ],
  declarations: [ClasslistPage]
})
export class ClasslistPageModule {}
