import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ActionSheetController, IonRouterOutlet, LoadingController, Platform, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';
import { UploadDocsService } from 'src/app/services/uploadDocs/upload-docs.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.page.html',
  styleUrls: ['./upload-documents.page.scss'],
})
export class UploadDocumentsPage implements OnInit {

  url: any
  serverMessage = [];
  errorMessage = '';
  selectProfileFile: any;
  aadharImageSource = '';
  panCardImageSource = '';
  drivingLicenseImageSource = '';
  liveImageSource = '';
  selectedAadharPhoto: any;
  selectedPanCardPhoto: any;
  selectedDlPhoto: any;
  selectedLivePhoto: any;
  isSubmitted: boolean;
  aadharImages = [];
  panCardImages = [];
  dlImages = [];
  liveImages = [];
  images = [];
  imageData=[];

  constructor(public actionSheetController: ActionSheetController, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private uploadDoc: UploadDocsService, private router: Router, private platform:Platform,
    private route: ActivatedRoute, private location: Location,
    @Optional() private routerOutlet?: IonRouterOutlet,) {
      
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);

      if (params) {
        this.url = params.url;
      }
    
    if(params.url == '/user-profile'){
      this.uploadDoc.getServiceDoc().subscribe({
        next: data => {
          this.imageData=data.getEmployeeDoc.imagePath

          
        }
      }) 
      }
      if (params.url == '/shop-user-profile'){
        this.uploadDoc.getShopDoc().subscribe({
          next: data => {
            this.imageData=data.getEmployeeDoc.imagePath

            
          }
        }) 
    }
    if (params.url == '/employee-profile'){
      this.uploadDoc.getEmployeeDoc().subscribe({
        next: data => {
          this.imageData=data.getEmployeeDoc.imagePath

          
        }
      })  
    }
  });  
  console.log(this.imageData);
  
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet.canGoBack()) {
        this.router.navigateByUrl(this.url).then(() => {
          // window.location.reload();
        });
      }
    }); 
   
  


  }

  async takeAadharPicture() {
    // this.errorMessage = [];
    this.serverMessage = [];
    this.aadharImageSource = '';
    this.selectedAadharPhoto = '';
    const permission = await Camera.checkPermissions();
    if (permission.photos !== 'granted') {
      const result = await Camera.requestPermissions();
    }
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
 
    this.aadharImages.push(image);
    console.log(this.aadharImages);
    
    this.aadharImageSource = image.dataUrl;

    this.selectedAadharPhoto = await fetch(this.aadharImageSource).then(r => r.blob());
    console.log(this.selectedAadharPhoto);

    this.images.push(this.selectedAadharPhoto)

  }
  async takePanCardPicture() {
    // this.errorMessage = [];
    this.serverMessage = [];
    this.panCardImageSource = '';
    this.selectedPanCardPhoto = '';
    const permission = await Camera.checkPermissions();
    if (permission.photos !== 'granted') {
      const result = await Camera.requestPermissions();
    }
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
 
    this.panCardImages.push(image);
    console.log(this.panCardImages);
    
    this.panCardImageSource = image.dataUrl;

    this.selectedPanCardPhoto = await fetch(this.panCardImageSource).then(r => r.blob());
    console.log(this.selectedPanCardPhoto);
    this.images.push(this.selectedPanCardPhoto)
  }
  async takeDrivingLicensePicture() {
    // this.errorMessage = [];
    this.serverMessage = [];
    this.drivingLicenseImageSource = '';
    this.selectedDlPhoto = '';
    const permission = await Camera.checkPermissions();
    if (permission.photos !== 'granted') {
      const result = await Camera.requestPermissions();
    }
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
 
    this.dlImages.push(image);
    console.log(this.dlImages);
    
    this.drivingLicenseImageSource = image.dataUrl;

    this.selectedDlPhoto = await fetch(this.drivingLicenseImageSource).then(r => r.blob());
    console.log(this.selectedDlPhoto);
    this.images.push(this.selectedDlPhoto)
  }
  async takeLivePicture() {
    // this.errorMessage = [];
    this.serverMessage = [];
    this.liveImageSource = '';
    this.selectedLivePhoto = '';
    const permission = await Camera.checkPermissions();
    if (permission.photos !== 'granted') {
      const result = await Camera.requestPermissions();
    }
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
 
    this.liveImages.push(image);
    console.log(this.liveImages);
    
    this.liveImageSource = image.dataUrl;

    this.selectedLivePhoto = await fetch(this.liveImageSource).then(r => r.blob());
    console.log(this.selectedLivePhoto);
    this.images.push(this.selectedLivePhoto)
  }

  async startUpload() {
    console.log(this.images);
    const formData = new FormData();
    formData.append("file", this.selectedAadharPhoto);
    formData.append("file", this.selectedPanCardPhoto);
    formData.append("file", this.selectedDlPhoto);
    formData.append("file", this.selectedLivePhoto);
    if(this.url == '/user-profile'){
    this.uploadServiceData(formData);
    }
    if (this.url == '/shop-user-profile'){
    this.uploadShopData(formData);
    }
    if (this.url == '/employee-profile'){
      this.uploadEmployeeDoc(formData);
      }
  }

  async presentToast(text: any) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 1500
    });
    toast.present();
  }

  async uploadServiceData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.uploadDoc.uploadServiceDoc(formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe({
      next: data => {
        console.log(data);

        this.selectedAadharPhoto = '';
        this.selectedPanCardPhoto = '';
        this.selectedDlPhoto = '';
        this.selectedLivePhoto = '';
        this.router.navigate(['/user-profile']);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.selectedAadharPhoto = '';
        this.selectedPanCardPhoto = '';
        this.selectedDlPhoto = '';
        this.selectedLivePhoto = '';
        // this.presentToast(this.errorMessage);
        this.router.navigate(['/user-profile']);
        // this.isSubmitted = false;
      }
    })
  }
  async uploadShopData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.uploadDoc.uploadShopDoc(formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe({
      next: data => {
        console.log(data);

        this.selectedAadharPhoto = '';
        this.selectedPanCardPhoto = '';
        this.selectedDlPhoto = '';
        this.selectedLivePhoto = '';
        this.router.navigate(['/shop-user-profile']);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.selectedAadharPhoto = '';
        this.selectedPanCardPhoto = '';
        this.selectedDlPhoto = '';
        this.selectedLivePhoto = '';
        // this.presentToast(this.errorMessage);
        this.router.navigate(['/shop-user-profile']);
        // this.isSubmitted = false;
      }
    })
  }
  async uploadEmployeeDoc(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.uploadDoc.uploadEmployeeDoc(formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe({
      next: data => {
        console.log(data);

        this.selectedAadharPhoto = '';
        this.selectedPanCardPhoto = '';
        this.selectedDlPhoto = '';
        this.selectedLivePhoto = '';
        this.router.navigate(['/employee-profile']);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.selectedAadharPhoto = '';
        this.selectedPanCardPhoto = '';
        this.selectedDlPhoto = '';
        this.selectedLivePhoto = '';
        // this.presentToast(this.errorMessage);
        this.router.navigate(['/employee-profile']);
        // this.isSubmitted = false;
      }
    })
  }
  
  public async showActionSheet(i: any,name: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
         if(name == 'aadhar'){
          this.aadharImages.splice(i)
         }
         if(name == 'panCard') {
          this.panCardImages.splice(i)
         }        
         if(name == 'dl') {
          this.dlImages.splice(i)
         }        
         if(name == 'live') {
          this.liveImages.splice(i)
         }        
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
        }
      }]
    });
    await actionSheet.present();
  }

   goBack() {
    this.location.back();
  }

}