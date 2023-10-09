import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeRegisterPageRoutingModule } from './employee-register-routing.module';

import { EmployeeRegisterPage } from './employee-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EmployeeRegisterPageRoutingModule
  ],
  declarations: [EmployeeRegisterPage]
})
export class EmployeeRegisterPageModule {}
