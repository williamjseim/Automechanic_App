import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VideoApiService {
  
  private url = `${environment.API_URL}/Video`
  
  
  constructor(private http: HttpClient) { }
  
  uploadVideo(issueId: string, data: FormData): Observable<any> {
    return this.http.put(`${this.url}/Upload?issueId=${issueId}`, data)
  }

  getVideo(issueId: string): Observable<any> {
    return this.http.get(`${this.url}/GetVideoIssue?issueId=${issueId}`);
  }

  getVideoStream(videoId: string): Observable<any> {
    return this.http.get(`${this.url}/streamvideo?videoId=${videoId}`, { responseType: 'arraybuffer'});
  }
}
