import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterPipe } from '../shop-product-details/filter.pipe';


@NgModule({
  declarations: [OrderComponent,FilterPipe],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
