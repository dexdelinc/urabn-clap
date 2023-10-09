import { getLocaleFirstDayOfWeek } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
// import { Photo } from '@capacitor/camera';
import { ActionSheetController, IonSearchbar } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PhotoService, UserPhoto } from 'src/app/services/photo/photo.service';
import { ServiceService } from 'src/app/services/service/service.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
declare let google: { maps: { places: { Autocomplete: new (arg0: HTMLInputElement) => any; }; }; }

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.page.html',
  styleUrls: ['./employee-register.page.scss'],
})
export class EmployeeRegisterPage implements OnInit {
  @ViewChild('autocomplete') autocomplete: IonSearchbar;

  isSubmitted = false;
  registerForm!: FormGroup;
  location: [];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  serviceData: any;
  photos: any;
  data: any;
  categoryVal: 'employee';
  label = 'Choose Category';
  fcmToken: any;

  constructor(private authService: AuthService, private router: Router, private service: ServiceService,
    public photoService: PhotoService, private shop: ShopService, public formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController, private plt: Platform, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private fcmService: FcmService,
    private http: HttpClient,) { }

  ngOnInit() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (isPushNotificationsAvailable) {
      this.initPushNotifications();
    }
    this.createForm();
  }
  initPushNotifications() {
    this.fcmService.getNewUserInfo().subscribe(token => {
      this.fcmToken = token;
    })
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: [''],
      rephone: ['', [Validators.pattern('^[0-9]+$')]],
      location: ['', [Validators.required]],
      geo_address: ['', [Validators.required]],
      camera: [this.photoService.photos],
      discription: ['']
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  ionViewDidEnter() {
    this.autocomplete.getInputElement().then((ref => {
      const autocomplete = new google.maps.places.Autocomplete(ref);
      autocomplete.addListener('place_changed', () => {
        let response = autocomplete.getPlace();

        console.log("respoinse----------", response.formatted_address);

        this.registerForm.patchValue({
          location: [response.geometry['location'].lat(), response.geometry['location'].lng()],
          geo_address: response.formatted_address
        })
        console.log(this.registerForm.get("location")?.value);
      })
    }))
  }

  // onClick(value: any) {
  //   console.log(value)
  //   this.categoryVal = value

  //   if (this.categoryVal == 'services') {
  //     this.label = "Choose Service";
  //     return this.service.services().subscribe({
  //       next: data => {
  //         this.serviceData = data.data
  //         console.log(this.serviceData)
  //       }
  //     })
  //   }

  //   if (this.categoryVal == 'shops') {
  //     this.label = "Choose Shop";
  //     return this.shop.shops().subscribe({
  //       next: data => {
  //         this.serviceData = data.data
  //         console.log(this.serviceData)
  //       }
  //     })
  //   }
  // }

  async onSubmit() {
    this.isSubmitted = true;
    if (!this.registerForm.valid) {
      console.log('Please provide all the required values!')
      return false
    }
    console.log(this.registerForm.get('phone')?.value);


    const params: NavigationExtras = {
      queryParams: {
        discription: this.registerForm.get('discription')?.value,
        phone: this.registerForm.get('phone')?.value, password: this.registerForm.get('password')?.value,
        firstname: this.registerForm.get('firstname')?.value, lastname: this.registerForm.get('lastname')?.value,
        email: this.registerForm.get('email')?.value, rephone: this.registerForm.get('rephone')?.value,
         location: this.registerForm.get('location')?.value,
        geo_address: this.registerForm.get('geo_address')?.value, categoryVal: 'employee',
        fcmToken: this.fcmToken,url:this.router.url
      },
    };

    this.router.navigate(['ionic-image'], params);
    // this.isSubmitted = true
    // if (!this.registerForm.valid) {
    //   console.log('Please provide all the required values!')
    //   return false
    // }
    // if (this.categoryVal == 'services') {
    //   // const { phone, firstname, lastname, email, rephone, password, location, service,geo_address} = this.form;
    //   this.authService.register(this.registerForm.get('phone')?.value, this.registerForm.get('password')?.value,
    //     this.registerForm.get('firstname')?.value, this.registerForm.get('lastname')?.value, this.registerForm.get('email')?.value,
    //     this.registerForm.get('rephone')?.value, this.registerForm.get('service')?.value, this.registerForm.get('location')?.value,
    //     this.registerForm.get('discription')?.value,this.registerForm.get('geo_address')?.value,).subscribe({
    //       next: data => {
    //         console.log(data);
    //         this.isSubmitted = true
    //         this.router.navigate(['/login'])
    //       },
    //       error: err => {
    //         this.errorMessage = err.error.message;
    //         this.isSubmitted = false;
    //       }
    //     });
    // }

    // if (this.categoryVal == 'shops') {

    //   // const { phone, firstname, lastname, email, rephone, password, location, service ,geo_address} = this.form;
    //   this.authService.shopUserRegister(this.registerForm.get('phone')?.value, this.registerForm.get('password')?.value,
    //     this.registerForm.get('firstname')?.value, this.registerForm.get('lastname')?.value, this.registerForm.get('email')?.value,
    //     this.registerForm.get('rephone')?.value, this.registerForm.get('service')?.value, this.registerForm.get('location')?.value,
    //     this.registerForm.get('discription')?.value,this.registerForm.get('geo_address')?.value,).subscribe({
    //       next: data => {
    //         console.log(data);
    //         this.isSubmitted = true

    //         this.router.navigate(['/shop-login'])
    //       },
    //       error: err => {
    //         this.errorMessage = err.error.message;
    //         this.isSubmitted = false

    //       }
    //     });
    // }
  }
}



