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

  login(data: any): Observable<any> {

    return this.http.put(`${this.url}/Login?username=${data.username}&password=${data.password}`, null, { responseType: "text" });
  }

  verifyToken(token: any): Observable<any> {
    return this.http.put(`${this.url}/Verify?token=${token}`, null)
  }
}
