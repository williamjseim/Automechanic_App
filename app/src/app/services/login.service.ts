import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private url = `${environment.API_URL}/User`

  
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) { }
  
  logout() {
    this.localStorageService.removeFromLocalStorage('token');
  }
  login(username:string, password:string): Observable<any> {
    return this.http.post(`${this.url}/Login?username=${username}&password=${password}`,null, { responseType: "text", observe: "response"});
  }

  verifyToken(token: any): Observable<any> {
    return this.http.put(`${this.url}/Verify?token=${token}`, null)
  }

  GetUser(userId: string = ""):Observable<any>{
    return this.http.get(`${this.url}/getuser?userid=${userId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.url}/delete?userid=${userId}`);
  }

}
