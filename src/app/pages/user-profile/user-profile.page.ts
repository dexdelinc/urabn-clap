import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Platform, IonRouterOutlet, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { TokenStorageService } from 'src/app/services/token/token.service';
import { environment } from 'src/environments/environment';
const URL = environment.baseUrl;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: any;
  firstName: any;
  lastName: any;
  phone: any;
  rephone: any;
  geo_address: any;
  email: any;
  status: any;
  ServiceName: any;
  startDate: any
  endMonth:any
  showPayment: boolean = true
  showPlan: boolean = false
  endYear:any
  endDate:any
  imageData: any;
  thumbnail: any;
  newImage: any;
  isToggled: true;
  message: any;
  avalStatus: any;
  url: any;
  constructor(private auth: AuthService, private router: Router, private payment: PaymentService,
    private tokenStorage: TokenStorageService, private platform: Platform, private http: HttpClient,
    private sanitizer: DomSanitizer, private toastController: ToastController,
    @Optional() private routerOutlet?: IonRouterOutlet) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet.canGoBack()) {
        this.router.navigateByUrl('/home').then(() => {
          // window.location.reload();
          history.go(0);
        });
      }
    }); 
  this.isToggled = true;
}
  ngOnInit() {
    this.auth.getuser().subscribe({
      next: data => {
        this.url = URL;
        this.imageData = data.getUser.imagePath
        // for (let i = 0; i < this.imageData.length; i++) {
        //   this.newImage = this.imageData[i]
        // }
        // console.log(this.newImage.data.data);
        // console.log(this.newImage.image.data);
        // let TYPED_ARRAY = new Uint8Array(this.imageData);
        // // const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);

        // const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        //   return data + String.fromCharCode(byte);
        // }, '')

        // let base64String = btoa(STRING_CHAR);

        // this.thumbnail = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + base64String);


        console.log(data.getUser)
        console.log(data)
        this.user = data.getUser
        this.firstName = this.user.firstname;
        this.lastName = this.user.lastname;
        this.phone = this.user.phone;
        this.rephone = this.user.rephone;
        this.geo_address = this.user.geo_address;
        this.email = this.user.email;
        this.status = this.user.status;
        if (this.status == 1) {
          setInterval(()=>{
            this.router.navigateByUrl('/payment')

          },100)
        }
        if (this.user.status == 2) {
          this.showPayment = false
          this.showPlan = true
        }
        if (this.status == 2) {
          this.payment.PaymentRecord().subscribe({
            next: data => {
              console.log(data);
              let startdate = new Date(data.getPayUser.createdAt);
              this.startDate = startdate
             let endMonth=new Date(data.message).getMonth()
              this.endMonth=endMonth
  console.log(endMonth);
  
              let endYear=new Date(data.message).getFullYear()
             this.endYear=endYear
             let enddate=new Date(data.message).getDate()
             this.endDate=enddate

            }

          })
        }

        // this.time=moment('2013-03-01', 'YYYY-MM-DD')

        //  console.log(this.time);


        // this.ServiceName=data.ServiceName
      }
    })
    if (this.status == 2) {
      this.payment.PaymentRecord().subscribe({
        next: data => {
          console.log(data);
          this.startDate = data.createdAt
          console.log(this.startDate);

        }

      })
    }


  }
  goBack(){
    this.router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }

  signOut() {
    this.tokenStorage.signOut();
    this.router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }

  async presentToast(position: 'top') {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  notify() {
    console.log("Toggled: " + this.isToggled);
    if (this.isToggled == true) {
      this.message = 'Service Available';
      this.avalStatus = 2;
      this.presentToast('top');
    } else {
      this.message = 'Service UnAvailable';
      this.avalStatus = 1;
      this.presentToast('top');
    }
    this.auth.updateServiceAvailStatus(this.avalStatus).subscribe({
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
  viewDoc(){
    const params: NavigationExtras = {
      queryParams: { url: this.router.url },
    };
    this.router.navigate(['/view-documents'],params)
  }
  orderRequest(){
    const params: NavigationExtras = {
      queryParams: { url: this.router.url },
    };
    this.router.navigate(['/delivery-request'],params)
  }

}


