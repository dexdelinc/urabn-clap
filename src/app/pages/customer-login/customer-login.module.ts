import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerLoginPageRoutingModule } from './customer-login-routing.module';

import { CustomerLoginPage } from './customer-login.page';

@NgModule({
  imports: [
    CustomerLoginPageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [CustomerLoginPage]
})
export class CustomerLoginPageModule {}
