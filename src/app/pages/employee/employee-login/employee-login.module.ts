import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeLoginPageRoutingModule } from './employee-login-routing.module';

import { EmployeeLoginPage } from './employee-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeLoginPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmployeeLoginPage]
})
export class EmployeeLoginPageModule {}
