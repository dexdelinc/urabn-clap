import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopLoginPage } from './shop-login.page';

const routes: Routes = [
  {
    path: '',
    component: ShopLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopLoginPageRoutingModule {}
