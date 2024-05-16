import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment.dev';


@Injectable({
  providedIn: 'root'
})
export class VideoApiService {

  private url = `${environment.API_URL}/Video`


  constructor(private http: HttpClient) { }

  uploadVideo(data: FormData): Observable<any> {
    return this.http.post(`${this.url}/Upload`, data)
  }
}
