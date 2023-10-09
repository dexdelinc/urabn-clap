import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicImagePage } from './ionic-image.page';

const routes: Routes = [
  {
    path: '',
    component: IonicImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IonicImagePageRoutingModule {}
