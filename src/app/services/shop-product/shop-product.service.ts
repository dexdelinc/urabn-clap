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
export class ShopProductService {

  constructor(private http: HttpClient, public tokenStorage: TokenStorageService) { }
  createShopProduct(formData: any): Observable<any> {
    return this.http.post(AUTH_API + 'create-shopProduct', formData, httpOptions);
  }
  getShopProduct(): Observable<any> {
    return this.http.get(AUTH_API + 'get-shopProduct', httpOptions)
  }

  updateShopProduct(name: string, quantity: number, price: number): Observable<any> {
    return this.http.patch(AUTH_API + 'update-shopProduct', {
      name,
      price,
      quantity
    }, httpOptions)
  }

  deleteShopProduct(p_id:string):Observable<any>{
    return this.http.post(AUTH_API+'delete-shopProduct',{
    p_id
    },httpOptions)
  }

  updateShopProductStatus(status: number,p_id:any): Observable<any> {
    return this.http.patch(AUTH_API + 'update-shop-product-status', {
      status,
      p_id
    }, httpOptions)
  }

  // get poduct by user id

  getShopProductById(shopUser_id:any,shop_id:any):Observable<any>{
    return this.http.post(AUTH_API+'get-shopProductById',{
      shopUser_id,shop_id
    })
  }
}
