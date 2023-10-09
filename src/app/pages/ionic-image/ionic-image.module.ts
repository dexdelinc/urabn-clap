import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IonicImagePageRoutingModule } from './ionic-image-routing.module';

import { IonicImagePage } from './ionic-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImagePageRoutingModule
  ],
  declarations: [IonicImagePage]
})
export class IonicImagePageModule {}
