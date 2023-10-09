import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ActionSheetController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PhotoService } from 'src/app/services/photo/photo.service';
@Component({
  selector: 'app-ionic-image',
  templateUrl: './ionic-image.page.html',
  styleUrls: ['./ionic-image.page.scss'],
})
export class IonicImagePage implements OnInit {

  categoryVal: any;
  discription: any;
  phone: any;
  password: any;
  lastname: any;
  email: any;
  firstname: any;
  geo_address: any;
  location: any;
  service: any;
  rephone: any;
  errorMessage = '';
  imageData: any;
  thumbnail: any;
  newImage: any;
reader: any = new FileReader();
  imageProfileSource = '';
  datetime = '';
  error = '';
  dobDisplay = '';
  dob = '';
  profilePhoto: File;
  serverMessage = [];
  selectProfileFile: any;
  imageSource = '';
  selectedPhoto: any;
  isSubmitted: boolean;
  fcmToken: any;
  url: any;
  needDelBag: string;
  constructor(public photoService: PhotoService, private route: ActivatedRoute,
    public actionSheetController: ActionSheetController, private plt: Platform, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private authService: AuthService,private router: Router,
    private http: HttpClient, private sanitizer: DomSanitizer) {
   
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      console.log(params.categoryVal);
      if(params.url=='/employee-register'){
       this.url=params.url
        this.categoryVal = params.categoryVal;
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.location = params.location;
        this.discription = params.discription;
        this.geo_address = params.geo_address;
        this.rephone = params.rephone;
        this.password = params.password;
        this.email = params.email;
        this.phone = params.phone;
        this.fcmToken = params.fcmToken
      }
    else{
        this.service = params.service;
        this.categoryVal = params.categoryVal;
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.location = params.location;
        this.discription = params.discription;
        this.geo_address = params.geo_address;
        this.rephone = params.rephone;
        this.password = params.password;
        this.email = params.email;
        this.phone = params.phone;
        this.fcmToken = params.fcmToken
        this.needDelBag=params.needDelBag
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
      resultType: CameraResultType.DataUrl,
    });
    this.imageSource = image.dataUrl;
    this.selectedPhoto = await fetch(this.imageSource).then(r => r.blob());
    console.log(this.selectedPhoto);
    
  }

  async startUpload() {
   
    if(this.url=='/employee-register'){
    const formData = new FormData();

      formData.append("file", this.selectedPhoto);
      formData.append("phone", this.phone)
      formData.append("firstname", this.firstname)
      formData.append("lastname", this.lastname)
      formData.append("location", this.location)
      formData.append("discription", this.discription)
      formData.append("geo_address", this.geo_address)
      formData.append("rephone", this.rephone)
      formData.append("password", this.password)
      formData.append("email", this.email)
      formData.append("type", this.categoryVal)
      formData.append("deviceToken", this.fcmToken)
      this.uploadData(formData);
    } else{
    const formData = new FormData();

    formData.append("file", this.selectedPhoto);
    formData.append("phone", this.phone)
    formData.append("firstname", this.firstname)
    formData.append("lastname", this.lastname)
    formData.append("location", this.location)
    formData.append("discription", this.discription)
    formData.append("geo_address", this.geo_address)
    formData.append("rephone", this.rephone)
    formData.append("password", this.password)
    formData.append("email", this.email)
    formData.append("service", this.service)
    formData.append("type", this.categoryVal)
    formData.append("deviceToken", this.fcmToken)
    formData.append("needDelBag", this.needDelBag)
    this.uploadData(formData);}
  }

  async presentToast(message: any,color:any) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color:color
    });
    toast.present();
  }

  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    // Use your own API!
    if (this.categoryVal == 'services') {
      // const { phone, firstname, lastname, email, rephone, password, location, service,geo_address} = this.form;
      this.authService.register(formData).pipe(
        finalize(() => {
          loading.dismiss();
        })
      ).subscribe({
        next: data => {
          console.log(data);
          this.isSubmitted = true
          // indexedDB.deleteDatabase("Disc");
          this.imageSource = '';
          this.presentToast(data.message,'success');

          this.router.navigate(['/login']);
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.imageSource = '';
          this.presentToast(this.errorMessage,'danger');
          this.router.navigate(['/home']);
          this.isSubmitted = false;
        }
      });
    }
    if (this.categoryVal == 'shops') {

      // const { phone, firstname, lastname, email, rephone, password, location, service ,geo_address} = this.form;
      this.authService.shopUserRegister(formData).pipe(
        finalize(() => {
          loading.dismiss();
        })
      ).subscribe({
        next: data => {
          console.log(data);
          this.isSubmitted = true
          // indexedDB.deleteDatabase("Disc");
          this.imageSource = '';
          this.presentToast(data.message,'success');

          this.router.navigate(['/shop-login']);
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.imageSource = '';
          this.presentToast(this.errorMessage,"danger");
          this.router.navigate(['/home']);
          // this.isSubmitted = false;
        }
      });
    }
    if (this.categoryVal == 'employee') {

      // const { phone, firstname, lastname, email, rephone, password, location, service ,geo_address} = this.form;
      this.authService.employeeRegister(formData).pipe(
        finalize(() => {
          loading.dismiss();
        })
      ).subscribe({
        next: data => {
          console.log(data);
          this.isSubmitted = true
          // indexedDB.deleteDatabase("Disc");
          this.imageSource = '';
          this.presentToast(data.message,'success');

          this.router.navigate(['/employee-login']);
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.imageSource = '';
          this.presentToast(this.errorMessage,'danger');
          this.router.navigate(['/home']);
          // this.isSubmitted = false;
        }
      });
    }
  }
 
}