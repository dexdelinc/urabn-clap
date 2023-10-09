import { Component, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';
import { TokenStorageService } from 'src/app/services/token/token.service';
import { environment } from 'src/environments/environment';
const URL = environment.baseUrl;
@Component({
  selector: 'app-user-profile',
  templateUrl: './shop-user-profile.page.html',
  styleUrls: ['./shop-user-profile.page.scss'],
})
export class ShopUserProfilePage implements OnInit {
  user: any;
  firstName: any;
  lastName: any;
  phone: any;
  rephone: any;
  geo_address: any;
  email: any;
  status: any;
  ServiceName: any;
  showPayment: boolean = true;
  showPlan: boolean = false;
  startDate: Date;
  endMonth: number;
  endYear: number;
  endDate: number;
  message: any;
  su_id: any;
  imageData: any;
  thumbnail: any;
  newImage: any;
  isToggled: true;
  avalStatus: any;
  url: any;
  constructor(
    private toastController: ToastController,
    private shopProduct: ShopProductService,
    private auth: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private platform: Platform,
    private payment: PaymentService,
    private alertController: AlertController,
    private sanitizer: DomSanitizer,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.isToggled= true;
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet.canGoBack()) {
        this.router.navigateByUrl('/home').then(() => {
          history.go(0);
        });
      }
    }); 
  }

  ngOnInit() {
    this.auth.getShopuser().subscribe({
      next: (data) => {
        this.url = URL;
        console.log(data.getUser.imagePath);
        
        this.imageData = data.getUser.imagePath;
        // // for (let i = 0; i < this.imageData.length; i++) {
        // //   this.newImage = this.imageData[i]
        // // }
        // // console.log(this.newImage.data.data);
        // // console.log(this.newImage.image.data);
        // let TYPED_ARRAY = new Uint8Array(this.imageData);
        // // const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);

        // const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        //   return data + String.fromCharCode(byte);
        // }, '');

        // let base64String = btoa(STRING_CHAR);

        // this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(
        //   'data:image/jpeg;base64,' + base64String
        // );

        console.log(data.getUser);
        console.log(data);
        this.user = data.getUser;
        this.firstName = this.user.firstname;
        this.lastName = this.user.lastname;
        this.phone = this.user.phone;
        this.rephone = this.user.rephone;
        this.geo_address = this.user.geo_address;
        this.email = this.user.email;
        this.status = this.user.status;
        this.su_id = this.user._id;

        if (this.status == 2) {
          this.showPayment = false;
          this.showPlan = true;
        }
        if (this.status == 1) {
          setInterval(()=>{
            this.router.navigateByUrl('/payment')

          },100)
        }
        if (this.status == 2) {
          this.payment.PaymentRecord().subscribe({
            next: (data) => {
              console.log(data);
              let startdate = new Date(data.getPayUser.createdAt);
              this.startDate = startdate;
              let endMonth = new Date(data.message).getMonth();
              this.endMonth = endMonth;
              console.log(endMonth);

              let endYear = new Date(data.message).getFullYear();
              this.endYear = endYear;
              let enddate = new Date(data.message).getDate();
              this.endDate = enddate;
            },
          });
        }

        // this.ServiceName = data.ServiceName
      },
    });

    if (this.status == 2) {
      this.payment.PaymentRecord().subscribe({
        next: (data) => {
          console.log(data);
          this.startDate = data.createdAt;
          console.log(this.startDate);
        },
      });
    }
  }
  signOut() {
    this.tokenStorage.signOut();
    this.router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }
 
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Please enter Product info',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'ADD',
          handler: (alertData) => {
            //takes the data
            const params: NavigationExtras = {
              queryParams: {
                name: alertData.name,
                price: alertData.price,
                quantity: alertData.quantity,
                description: alertData.description,
              },
            };
            console.log(alertData);
            if (
              alertData.name !== '' &&
              alertData.price !== '' &&
              alertData.quantity !== '' &&
              alertData.description !== ''
            ) {
              this.router.navigate(['image'], params);
            } else {
              this.message = 'All input is required';
              this.presentToast('top');
              // return;
            }
            // this.shopProduct.createShopProduct(alertData.name, alertData.price, alertData.quantity,alertData.description).subscribe({
            //   next: data => {
            //     console.log(data)
            //     this.message=data.message

            //     this.presentToast('top')
            //   }
            // })
          },
        },
      ],
      inputs: [
        {
          name: 'name',
          placeholder: 'Product-Name',
        },

        {
          name: 'price',
          type: 'number',
          placeholder: 'Price',
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity',
        },
        {
          name: 'description',
          placeholder: 'description',
        },
      ],
    });

    await alert.present();
  }

  async presentToast(position: 'top') {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  goBack() {
    this.router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }

  onOrder() {
    console.log(this.user.location.coordinates);
    
    const params: NavigationExtras = {
      queryParams: { location: this.user.location.coordinates },
    };
    this.router.navigate(['/order'], params);
  }
  

  notify() {
    console.log("Toggled: " + this.isToggled);
    if(this.isToggled == true){
      this.message = 'Shop Available';
      this.avalStatus = 2;
      this.presentToast('top');
    }else{
      this.message = 'Shop UnAvailable';
      this.avalStatus = 1;
      this.presentToast('top');
    }
    this.auth.updateShopAvailStatus(this.avalStatus).subscribe({
      next: data => {
        console.log(data); 
      } 
    })
  }

  uploadDoc(){
    const params: NavigationExtras = {
      queryParams: { url: this.router.url },
    };

    this.router.navigate(['/upload-documents'],params)
  }

  viewDoc() {
    const params: NavigationExtras = {
      queryParams: { url: this.router.url },
    };
    this.router.navigate(['/view-documents'], params)
  }

  earning(){
    const params: NavigationExtras = {
      queryParams: { url: this.router.url },
    };

    this.router.navigate(['/earning'],params)

  }
}
