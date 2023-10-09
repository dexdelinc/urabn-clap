import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopProductDetailsPageRoutingModule } from './shop-product-details-routing.module';

import { ShopProductDetailsPage } from './shop-product-details.page';
import { FilterPipe } from './filter.pipe';
import { CartService } from 'src/app/services/cart/cart.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopProductDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ShopProductDetailsPage,FilterPipe],
  providers: [CartService]
})
export class ShopProductDetailsPageModule {}
