import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertButton, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm:FormGroup;
  isLoggedIn = false;
  errorMessage: any;
  showPassword=false
  passwordToggleIcon='eye'
  constructor(private toastCtrl:ToastController, public formBuilder: FormBuilder,private router:Router,private authService: AuthService,private alertController:AlertController,
    private tokenStorage: TokenStorageService) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password:['',[Validators.required,]]
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
      // message: this.errorMessage,
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
 this.isLoggedIn=true
 if (!this.loginForm.valid) {
  console.log('Please provide all the required values!')
  return false;
}else{  
    this.authService.signin(this.loginForm.get('phone')?.value, this.loginForm.get('password')?.value).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.token);
        this.isLoggedIn = true;
        this.router.navigate(['/user-profile'])
        this.presentToast(data.message,'success')
        // this.reloadPage();
      },error: err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
        this.isLoggedIn = false;
        this.presentToast(err.error.message,'danger')

      }
    });}
  }
  reloadPage(): void {
    window.location.reload();
  }
}
