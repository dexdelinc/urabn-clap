import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopUserProfilePage } from './shop-user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ShopUserProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopUserProfilePageRoutingModule {}
