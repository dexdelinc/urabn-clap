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
  providedIn: 'root'
})
export class GetuserServiceService {

  constructor(private http:HttpClient) { }

  register(phone: number, firstname: string, lastname: string, email: string,rephone:string,password: string, location: string,service:string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      phone,
      firstname,
      lastname,
      email,
      rephone,
      password,
      location,
      service,
      
    },httpOptions);
  }
}
