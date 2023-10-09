import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { IonSearchbar, ActionSheetController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { ServiceService } from 'src/app/services/service/service.service';
import { ShopService } from 'src/app/services/shop/shop.service';
declare var google
@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.page.html',
  styleUrls: ['./customer-register.page.scss'],
})
export class CustomerRegisterPage implements OnInit {
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
  categoryVal: any;
  label = 'Choose Category';
  fcmToken: any;

  constructor(private authService: AuthService, private router: Router, private toastCtrl: ToastController,
    public photoService: PhotoService, private shop: ShopService, public formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController, private fcmService: FcmService) { }

  ngOnInit() {
    // this.loadPhotos();
    this.createForm();
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


        // this.location.coordinates.push.apply(response.geometry['location'].lat(),response.geometry['location'].lng())


        this.registerForm.patchValue({
          location: [response.geometry['location'].lat(), response.geometry['location'].lng()],
          geo_address: response.formatted_address
        })
        console.log(this.registerForm.get("location")?.value);


        //     this.form.location = this.location;
        //console.log(this.location);

        //     this.form.location = this.location;

      })
    }))
  }

  async presentToast(text: any) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 1500
    });
    toast.present();
  }

  async onSubmit() {
    //  await  this.loadPhotos()
    console.log(this.registerForm.value);
    console.log(this.categoryVal);

    this.isSubmitted = true
    if (!this.registerForm.valid) {
      console.log('Please provide all the required values!')
      return false
    }

    // const { phone, firstname, lastname, email, rephone, password, location, service ,geo_address} = this.form;
    this.authService.registerCustomer(this.registerForm.get('phone')?.value, this.registerForm.get('password')?.value,
      this.registerForm.get('firstname')?.value, this.registerForm.get('lastname')?.value, this.registerForm.get('email')?.value,
      this.registerForm.get('rephone')?.value, this.registerForm.get('location')?.value,
      this.registerForm.get('geo_address')?.value,this.fcmToken).subscribe({
        next: data => {
          console.log(data);
          this.isSubmitted = true;
          this.presentToast(data.message);
          this.router.navigate(['/customer-login'])
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.presentToast(err.error.message);
          this.isSubmitted = false
          this.router.navigate(['/customer-login'])
        }
      });
  }
}
