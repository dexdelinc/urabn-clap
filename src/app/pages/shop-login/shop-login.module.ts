import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopLoginPageRoutingModule } from './shop-login-routing.module';

import { ShopLoginPage } from './shop-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopLoginPageRoutingModule,
    ReactiveFormsModule

  ],
  declarations: [ShopLoginPage]
})
export class ShopLoginPageModule {}
