import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeLoginPage } from './employee-login.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeLoginPageRoutingModule {}
