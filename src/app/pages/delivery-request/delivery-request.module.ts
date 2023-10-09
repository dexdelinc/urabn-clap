import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryRequestPageRoutingModule } from './delivery-request-routing.module';

import { DeliveryRequestPage } from './delivery-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryRequestPageRoutingModule
  ],
  declarations: [DeliveryRequestPage]
})
export class DeliveryRequestPageModule {}
