import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoApiService {

  private port = "5142";
  private url = `http://localhost:${this.port}/Video`

  constructor(private http: HttpClient) { }

  uploadVideo(data: FormData): Observable<any> {
    return this.http.post(`${this.url}/Upload`, data)
  }
}
