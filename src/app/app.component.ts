import { Component, Optional } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loader = true;
  constructor(private platform: Platform, public router: Router) {
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      }
    });

    this.intializeApp();
  }
  intializeApp() {
    this.platform.ready().then(async () => {
      await SplashScreen.hide({
        fadeOutDuration: 2,
      });
      // this.router.navigateByUrl('starter')
    });
  }

  ngOnInit() {}

  //   private async showSplash(){
  // console.log("1111111111111111111111");

  //     await this.platform.ready()
  //     console.log("1111111111111111111111");

  //     const lottie= (window as any).lottie
  //     if(lottie){
  //       await lottie.splashscreen.hide()
  //       console.log("1111111111111111111111");

  //       await lottie.splashscreen.show('public/assets/splash.json')
  // console.log("1111111111111111111111");

  //     }
  // }
}
