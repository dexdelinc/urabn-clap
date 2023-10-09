import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.page.html',
  styleUrls: ['./customer-login.page.scss'],
})
export class CustomerLoginPage implements OnInit {
  loginForm: FormGroup
  isLoggedIn = false;
  errorMessage: any;
  url: any;
  showPassword=false
  passwordToggleIcon='eye'
  constructor(public formBuilder: FormBuilder, private router: Router, private authService: AuthService, private alertController: AlertController,
    private tokenStorage: TokenStorageService,private route: ActivatedRoute, private toastCtrl:ToastController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);

      if (params) {
        this.url = params.url;
      }
    });
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required,]]
    })
  }
  toggle(){
    this.showPassword=!this.showPassword
    if(this.passwordToggleIcon==='eye'){
      this.passwordToggleIcon='eye-off'
    }else{
      this.passwordToggleIcon='eye'

    }
  }
  get errorControl() {
    return this.loginForm.controls;
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: this.errorMessage,
      message: this.errorMessage,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }
  async onSubmit() {
    this.isLoggedIn = true
    if(this.url != 'employee'){
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      this.authService.customerSignin(this.loginForm.get('phone')?.value, this.loginForm.get('password')?.value).subscribe({
        next: data => {
          this.tokenStorage.saveToken(data.token);

          this.isLoggedIn = true;
          this.presentToast(data.message,'success')
          this.router.navigateByUrl('/home').then(() => {
            window.location.reload();
          });
          // this.reloadPage();
        }, error: err => {
          this.presentAlert()
          this.errorMessage = err.error.message;

          this.isLoggedIn = false;
          this.presentToast(err.error.message,'danger')

        }
      });
    }
    }
    if (this.url == 'employee') {
      if (!this.loginForm.valid) {
        console.log('Please provide all the required values!')
        return false;
      } else {
        this.authService.employeeSignin(this.loginForm.get('phone')?.value, this.loginForm.get('password')?.value).subscribe({
          next: data => {
            this.tokenStorage.saveToken(data.token);

            this.isLoggedIn = true;

            this.router.navigateByUrl('/home').then(() => {
              window.location.reload();
            });
            // this.reloadPage();
          }, error: err => {
            this.presentAlert()
            this.errorMessage = err.error.message;

            this.isLoggedIn = false;
          }
        });
      }
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
}