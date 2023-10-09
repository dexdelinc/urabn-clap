import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadDocumentsPageRoutingModule } from './upload-documents-routing.module';

import { UploadDocumentsPage } from './upload-documents.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadDocumentsPageRoutingModule
  ],
  declarations: [UploadDocumentsPage]
})
export class UploadDocumentsPageModule {}
