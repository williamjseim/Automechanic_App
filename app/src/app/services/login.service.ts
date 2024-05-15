import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private port = "5142";
  private url = `http://localhost:${this.port}/User`
  
  constructor(private http: HttpClient) { }

  login(username:string, password:string): Observable<any> {
    return this.http.post(`${this.url}/Login?username=${username}&password=${password}`,null, { responseType: "text"});
  }
}
