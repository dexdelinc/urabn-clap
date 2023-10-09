import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryRequestPage } from './delivery-request.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryRequestPageRoutingModule {}
