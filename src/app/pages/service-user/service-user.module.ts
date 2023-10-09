import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceUserPageRoutingModule } from './service-user-routing.module';

import { ServiceUserPage } from './service-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceUserPageRoutingModule
  ],
  declarations: [ServiceUserPage]
})
export class ServiceUserPageModule {}
