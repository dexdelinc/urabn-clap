import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
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
export class ConsumerService {

  constructor(private http:HttpClient){} 
  consumer(name:string,phone:number,user:string,):Observable<any>{
    return this.http.post(AUTH_API+'getserviceUser',{
      phone,
      name,
      user
    },httpOptions)

  }
}
