import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ActionSheetController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';
@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {

  name: any;
  description: any;
  quantity: any;
  price: any;
  serverMessage = [];
  errorMessage = '';
  selectProfileFile: any;
  imageSource = '';
  selectedPhoto: any;
  isSubmitted: boolean;
  constructor(public photoService: PhotoService, private route: ActivatedRoute,
    public actionSheetController: ActionSheetController, private plt: Platform, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private authService: AuthService, private router: Router, private shopProduct: ShopProductService,
    private http: HttpClient, private sanitizer: DomSanitizer) {

  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);

      if (params) {
        this.name = params.name;
        this.quantity = params.quantity;
        this.description = params.description;
        this.price = params.price;
      }
    });
  }

  async takeTitlePicture() {
    // this.errorMessage = [];
    this.serverMessage = [];
    this.imageSource = '';
    this.selectedPhoto = '';
    const permission = await Camera.checkPermissions();
    if (permission.photos !== 'granted') {
      const result = await Camera.requestPermissions();
    }
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
    this.imageSource = image.dataUrl;
    console.log(this.imageSource);
    
    this.selectedPhoto = await fetch(this.imageSource).then(r => r.blob());
    console.log(this.selectedPhoto);

  }

  async startUpload() {

    const formData = new FormData();
    formData.append("file", this.selectedPhoto);
    formData.append("name", this.name)
    formData.append("quantity", this.quantity)
    formData.append("price", this.price)
    formData.append("description", this.description)
    this.uploadData(formData);
  }

  async presentToast(text: any) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 1500
    });
    toast.present();
  }

  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.shopProduct.createShopProduct(formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe({
            next: data => {
              console.log(data);
              
              this.imageSource = '';
              this.router.navigate(['/shop-user-profile']);
              this.presentToast(data.message);

           },
            error: err => {
              this.errorMessage = err.error.message;
              this.imageSource = '';
              this.router.navigate(['/shop-user-profile']);
              // this.isSubmitted = false;
            }
          })
  }

  public async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.imageSource = ''
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

}