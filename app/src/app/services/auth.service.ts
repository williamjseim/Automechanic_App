import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, share } from 'rxjs';

import { environment } from '../environment.dev';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = `${environment.API_URL}/User`

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) { }

  logout() {
    this.localStorageService.removeFromLocalStorage('token');
  }

  login(data: any): Observable<any> {

    let req = this.http.put(`${this.url}/Login?username=${data.username}&password=${data.password}`, null, {
      responseType: "text"
    }).pipe(share());

    req.subscribe(r => {
      this.localStorageService.addToLocalStorage('token', r)
    });

    return req;
  }

  verifyToken(token: any): Observable<any> {
    return this.http.put(`${this.url}/Verify?token=${token}`, null)
  }
}
