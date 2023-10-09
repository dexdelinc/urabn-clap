import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../token/token.service';
import { FcmService } from '../fcm/fcm.service';
import { Capacitor } from '@capacitor/core';
const AUTH_API = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    "X-Custom-Header": "application/json",
    // "x-access-token":token//
   "Access-Control-Allow-Headers": "Content-Type,Access-Control-Allow-Headers,lang"

  })
};
// const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  fcmToken: any;

  constructor(private http: HttpClient, public tokenStorage: TokenStorageService,private fcmService:FcmService) {
    this.initPushNotifications();
   }
  //register as service user
  ngOnInit() {

      
    


  }
  initPushNotifications() {
    this.fcmService.getNewUserInfo().subscribe(token => {
      this.fcmToken = token;
      console.log("02222222222222222222222222222222222222222222222222220222222@@@@@@@@@@",this.fcmToken);
      
    })
  }
  register(formData: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', formData, httpOptions);
  }

  //register as customer
  registerCustomer(phone: number, password: string, firstname: string, lastname: string, email: string, rephone: string, location: [], geo_address: string,deviceToken: any): Observable<any> {
    return this.http.post(AUTH_API + 'create-customer', {
      phone,
      password,
      firstname,
      lastname,
      email,
      rephone,
      location,
      geo_address,
      deviceToken
    }, httpOptions);
  }
  //register as shop user
  shopUserRegister(formData: any): Observable<any> {
    return this.http.post(AUTH_API + 'shop-user-signup', formData, httpOptions);
  }
//Resister for employee
employeeRegister(formData: any): Observable<any> {
  return this.http.post(AUTH_API + 'employee-register', formData, httpOptions);
}
//Login for employee
employeeSignin(phone: number, password: string): Observable<any> {
  return this.http.post(AUTH_API + 'employee-login', {
    phone, password,deviceToken:this.fcmToken
  }, httpOptions)
}
  // sign in as serviceUser
  signin(phone: number, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      phone, password,deviceToken:this.fcmToken
    }, httpOptions)
  }
// for changing live location for delevery boy
updateTempLocation(lat: any, lng: any): Observable<any> {
  return this.http.patch(AUTH_API + 'updateTempLocation', {
    lat,lng
  }, httpOptions)

}
  // signin as shop user
  shopUserSignin(phone: number, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'shop-user-login', {
      phone, password,deviceToken:this.fcmToken
    }, httpOptions)

  }

  updateShopAvailStatus(avalStatus: any): Observable<any> {
    return this.http.patch(AUTH_API + 'changeShopAvalStatus', {
      avalStatus
    }, httpOptions)

  }
  updateServiceAvailStatus(avalStatus: any): Observable<any> {
    return this.http.patch(AUTH_API + 'changeServiceAvalStatus', {
      avalStatus
    }, httpOptions)

  }

  // signin as customer
  customerSignin(phone: number, password: string,): Observable<any> {
    return this.http.post(AUTH_API + 'customer-login', {
      phone, password,deviceToken:this.fcmToken
    }, httpOptions)

  }
  uploadImage(formData: any): Observable<any> {
    return this.http.post(AUTH_API + 'image', formData, httpOptions)
  }
  // shop user profile
  getShopuser(): Observable<any> {
    return this.http.get(AUTH_API + 'shop-user-profile', httpOptions)
  }

  token = this.tokenStorage.getToken()
  getuser(): Observable<any> {
    return this.http.get(AUTH_API + 'profile', httpOptions)
  }

  getCustomer(): Observable<any> {
    return this.http.get(AUTH_API + 'get-customer', httpOptions)
  }
  getEmployee(): Observable<any> {
    return this.http.get(AUTH_API + 'get-employee', httpOptions)
  }



  getservice(service: string, lat: string, lng: string): Observable<any> {

    return this.http.post(AUTH_API + 'service-provider-user', {
      service,
      lat,
      lng
    }, httpOptions)


  }

  getshop(shop: string, lat: string, lng: string): Observable<any> {

    return this.http.post(AUTH_API + 'shop-provider-user', {
      shop, lat, lng
    }, httpOptions)

  }

  getServiceData(): Observable<any> {

    return this.http.get(AUTH_API + 'profileS',)
  }
}