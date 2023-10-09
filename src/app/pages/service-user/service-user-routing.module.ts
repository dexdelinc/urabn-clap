import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceUserPage } from './service-user.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceUserPageRoutingModule {}
