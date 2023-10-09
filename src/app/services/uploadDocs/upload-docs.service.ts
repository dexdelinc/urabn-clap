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
export class UploadDocsService {

  constructor(private http: HttpClient) { }

  uploadServiceDoc(formData: any): Observable<any> {
    return this.http.post(AUTH_API + 'uploadServiceDoc', formData, httpOptions)
  }

  getServiceDoc(): Observable<any> {
    return this.http.get(AUTH_API + 'getServiceDoc', httpOptions)
  }

  uploadShopDoc(formData: any): Observable<any> {
    return this.http.post(AUTH_API + 'uploadShopDoc', formData, httpOptions)
  }

  getShopDoc(): Observable<any> {
    return this.http.get(AUTH_API + 'getShopDoc', httpOptions)
  }
  uploadEmployeeDoc(formData: any): Observable<any> {
    return this.http.post(AUTH_API + 'uploadEmployeeDoc', formData, httpOptions)
  }

  getEmployeeDoc(): Observable<any> {
    return this.http.get(AUTH_API + 'getEmployeeDoc', httpOptions)
  }
}
