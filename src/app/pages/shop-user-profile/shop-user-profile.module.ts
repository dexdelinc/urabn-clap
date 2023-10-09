import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopUserProfilePageRoutingModule } from './shop-user-profile-routing.module';

import { ShopUserProfilePage } from './shop-user-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopUserProfilePageRoutingModule
  ],
  declarations: [ShopUserProfilePage]
})
export class ShopUserProfilePageModule {}
