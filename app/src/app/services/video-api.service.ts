import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * VideoApiService
 * 
 * This service provides methods to interact with the video API endpoints. It includes functionality for 
 * uploading videos related to issues, retrieving video details, and streaming video content. The service 
 * uses Angular's HttpClient to make HTTP requests and handles responses using RxJS Observables.
 */

@Injectable({
  providedIn: 'root'
})
export class VideoApiService {
  
  private url = `${environment.API_URL}/Video`
  
  
  constructor(private http: HttpClient) { }

  /**
 * Uploads a video associated with a specific issue.
 * @param issueId The ID of the issue the video is related to.
 * @param data The FormData object containing the video file to upload.
 * @returns An Observable indicating the result of the upload operation.
 */
  uploadVideo(issueId: string, data: FormData): Observable<any> {
    return this.http.put(`${this.url}/Upload?issueId=${issueId}`, data)
  }

  /**
 * Retrieves video details associated with a specific issue.
 * @param issueId The ID of the issue for which to retrieve video details.
 * @returns An Observable with the video details.
 */
  getVideo(issueId: string): Observable<any> {
    return this.http.get(`${this.url}/GetVideoIssue?issueId=${issueId}`);
  }

  /**
 * Streams video content by video ID.
 * @param videoId The ID of the video to stream.
 * @returns An Observable with the video content as an array buffer.
 */
  getVideoStream(videoId: string): Observable<any> {
    return this.http.get(`${this.url}/streamvideo?videoId=${videoId}`, { responseType: 'arraybuffer'});
  }
}
