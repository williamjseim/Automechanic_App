import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, delay } from 'rxjs';
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
    this.localStorageService.removeFromLocalStorage('isadmin');
    this.localStorageService.removeFromLocalStorage('refreshtoken');

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

  createUser(username: string, email: string, password: string, role: number): Observable<any> {
    return this.http.post(`${this.url}/Register?username=${username}&email=${email}&password=${password}&role=${role}`, null, { responseType: "text", observe: "response"});
  }
  getAllUsers(page: number, amount: number, username: string = ""): Observable<any> {
    return this.http.get(`${this.url}/getallusers?startingIndex=${page}&amount=${amount}&username=${username}`);
  }
  getUserPages(amountPrPage: number, username: string = ""): Observable<any> {
    return this.http.get(`${this.url}/userpages?amountPrPage=${amountPrPage}&username=${username}`);
  } 

}
