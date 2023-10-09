import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadDocsService } from 'src/app/services/uploadDocs/upload-docs.service';
import { environment } from 'src/environments/environment';
import { Location } from "@angular/common";
import { IonRouterOutlet, Platform } from '@ionic/angular';

const URL = environment.baseUrl;
@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.page.html',
  styleUrls: ['./view-documents.page.scss'],
})
export class ViewDocumentsPage implements OnInit {
  serviceUserId: any;
  shopUserId: any;
  imageData: any;
  imagetitle: any;
  title: any;
  url: any
  paramUrl: any
  employeeId: any;
  constructor(private uploadDoc: UploadDocsService, private route: ActivatedRoute, private location: Location,private platform:Platform,private router:Router
   , @Optional() private routerOutlet?: IonRouterOutlet,) {
      this.platform.backButton.subscribeWithPriority(-1, () => {
        if (this.routerOutlet.canGoBack()) {
          this.router.navigateByUrl('/shop-user-profile').then(() => {
            // window.location.reload();
          });
        }
      }); 
     }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);

      if (params) {
        this.paramUrl = params.url;
      }
    });
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet.canGoBack()) {
        this.router.navigateByUrl(this.paramUrl).then(() => {
          // window.location.reload();
        });
      }
    }); 
    if(this.paramUrl == '/user-profile'){
    this.getServiceDoc();    
    }
    if (this.paramUrl == '/shop-user-profile'){
    this.getShopDoc();    
  }
  if (this.paramUrl == '/employee-profile'){
    this.getEmployeeDoc();    
  }
  }

  getServiceDoc(){
    this.url = URL;
    console.log(this.url);
    
    this.uploadDoc.getServiceDoc().subscribe({
      next: data => {
        this.serviceUserId = data.getServiceDoc.serviceUserId;
        this.imageData = data.getServiceDoc.imagePath
      }
    })
  }
  getShopDoc(){
    this.url = URL;
    console.log(this.url);
    
    this.uploadDoc.getShopDoc().subscribe({
      next: data => {
        this.shopUserId = data.getShopDoc.shopUserId;
        this.imageData = data.getShopDoc.imagePath
      }
    })
  }
  getEmployeeDoc(){
    this.url = URL;
    console.log(this.url);
    
    this.uploadDoc.getEmployeeDoc().subscribe({
      next: data => {
        this.employeeId = data.getEmployeeDoc.employeeId;
        this.imageData = data.getEmployeeDoc.imagePath
      }
    })
  }

  goBack() {
    this.location.back();
  }
}
