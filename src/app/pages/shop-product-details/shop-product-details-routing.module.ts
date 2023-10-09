import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopProductDetailsPage } from './shop-product-details.page';

const routes: Routes = [
  {
    path: '',
    component: ShopProductDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopProductDetailsPageRoutingModule {}
