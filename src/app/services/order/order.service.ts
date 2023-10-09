import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const AUTH_API = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    "X-Custom-Header": "application/json",
    // "x-access-token":token//
  })
};
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(
    name: string,
    phone: number,
    email: string,
    item: any,
    orderItemPrice: any,
    totalPrice: number,
    totalProduct: number,
    address: string,
    location: [],
    product: any,
    su_id: any
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'create-order',
      {
        name,
        phone,
        email,
        item,
        orderItemPrice,
        totalPrice,
        totalProduct,
        address,
        location,
        product,
        su_id,
      },
      httpOptions
    );
  }

  getOrderByPhone(phone: number): Observable<any> {
    return this.http.post(
      AUTH_API + 'get-orderByPhone',
      {
        phone,
      },
      httpOptions
    );
  }
  getOrderById(su_id: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'get-orderById',
      {
        su_id,
      },
      httpOptions
    );
  }
  getOrders(): Observable<any> {
    return this.http.get(AUTH_API + 'get-orderauthById', {});
  }

  //update order for shop user
  updateOrder(o_id: any, status: number): Observable<any> {
    return this.http.post(
      AUTH_API + 'update-order-status',
      {
        o_id,
        status,
      },
      httpOptions
    );
  }
  updateDeliveryStatus(o_id: any, deliveryStatus: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'updateDeliveryStatus',
      {
        o_id,
        deliveryStatus,
      },
      httpOptions
    );
  }

  getOrderProducts(op_id: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'get-orderProduct',
      {
        op_id,
      },
      httpOptions
    );
  }

  UpdateOrderProducts(o_id: any, item, totalPrice): Observable<any> {
    return this.http.post(
      AUTH_API + 'update-orderProduct',
      {
        o_id,
        item,
        totalPrice,
      },
      httpOptions
    );
  }
  deliveryProviderUser(lat: any, lng: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'deliveryProviderUser',
      { lat, lng },
      httpOptions
    );
  }
  getOrderForCustomer():Observable<any>{
    return this.http.get(AUTH_API + 'getOrderForCustomer',httpOptions);
  }
  // add delivry boy to order
  addDeliveryBoy(deliveryBoy:any): Observable<any> {
    return this.http.patch(
      AUTH_API + 'addDeliveryBoy',
      {
        deliveryBoy
      },
      httpOptions
    );
  }
  // get order delivey request getOrderForDeliveryBoy
  getOrderForDeliveryBoy(): Observable<any> {
    return this.http.get(AUTH_API + 'getOrderForDeliveryBoy', httpOptions)
  }
  acceptOrderByDeliveryBoy():Observable<any>{
    return this.http.patch(AUTH_API + 'acceptOrderByDeliveryBoy', httpOptions)
  }
  getDeliveryBoyById(id:any):Observable<any>{
    return this.http.post(AUTH_API+'getDeliveryBoyById',{
      id
    },httpOptions)
  }
}

