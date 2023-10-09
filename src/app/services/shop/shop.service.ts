import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

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
export class ShopService {

  constructor(private http:HttpClient) { }
  shops(search?:any):Observable<any>{
  
    return this.http.post(AUTH_API+'shops',{
      search,
    },httpOptions);
  
   }
}
