import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../token/token.service';
const AUTH_API = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    "X-Custom-Header": "application/json",
    // "x-access-token":token//

  })
};
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  constructor(private http: HttpClient, public tokenStorage: TokenStorageService) { }
  payoutRequest(amount:number){
    return this.http.post(AUTH_API + 'payoutRequest', {
      amount
    }, httpOptions);
  } 
  
  getpayoutRequest(){
    return this.http.get(AUTH_API + 'getpayoutRequest', httpOptions);
  }
  addBank(name:any,bankAccount:any){
    return this.http.post(AUTH_API + 'addBank', {
      name,
      bankAccount
    }, httpOptions);
  }

  shopWithdrawl(amt:any,bankId:any){
    return this.http.post(AUTH_API + 'shopWithdrawl', {
    amt,bankId
    }, httpOptions);
  }
  userPayment(status: Number, usertype: string, response: {}): Observable<any> {
    return this.http.post(AUTH_API + 'payment-record', {
      status,
      usertype,
      response
    }, httpOptions);
  }

  orderPaymentRecord(status: Number, usertype: string, orderId: any, response: {}): Observable<any> {
    return this.http.post(AUTH_API + 'orderPaymentRecord', {
      status,
      usertype,
      orderId,
      response
    }, httpOptions);
  }

  PaymentRecord(): Observable<any> {
    return this.http.get(AUTH_API + 'get-user-payment-record', httpOptions)
  }
  getChargesInformation():Observable<any>{
    return this.http.get(AUTH_API+'getChargesInformation',httpOptions)
  }
  payUBuy() {
    return this.http.get<any>(AUTH_API+"payuPayment");
  }
}
