import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor/token-interceptor.service';
// import { SplashScreen } from '@capacitor/splash-screen';
import { ReactiveFormsModule } from '@angular/forms';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
let publishableKey='pk_test_51Mc4HxSInjEP45qtz9nVO5tvHHnVHs2KBFU77HSSpf2EWy4eBbjiiwqZUlb4UwOSRdMPxzrmLFDP7wMBtvVO5prr00hHaG8FWn'
@NgModule({
  declarations: [AppComponent,],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,ReactiveFormsModule,IonicSelectableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true

    },
    

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
