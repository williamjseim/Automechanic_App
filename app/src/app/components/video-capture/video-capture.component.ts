import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

import { MatIconModule } from '@angular/material/icon';
import { VideoApiService } from '../../services/video-api.service';

@Component({
  selector: 'app-video-capture',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProgressBarComponent],
  templateUrl: './video-capture.component.html',
  styleUrl: './video-capture.component.css'
})
export class VideoCaptureComponent {
  videoFile!: File;
  videoURL!: string;

  constructor(private apiService: VideoApiService) { }
  openCamera() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.capture = 'camcorder';
    input.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.videoFile = target.files[0];
        this.videoURL = URL.createObjectURL(this.videoFile);
        this.sendVideoToAPI();
      }
    });
    input.click();
  }

  selectVideo() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.videoFile = file;
      this.videoURL = URL.createObjectURL(file);
      this.sendVideoToAPI();
    }
  }

  sendVideoToAPI() {
    // Implement logic to send the video file to your API
    // Example:
    const formData = new FormData();
    formData.append('video', this.videoFile);

    this.apiService.uploadVideo(formData).subscribe(
      response => {
        console.log(`File sent to api `, response);
      },
      error => {
        console.log(error);
      }
    )
    // Call your API endpoint using HttpClient
    // Example:
    // this.http.post('your-api-url', formData).subscribe(response => {
    //   console.log('Video uploaded successfully:', response);
    // }, error => {
    //   console.error('Error uploading video:', error);
    // });
  }
}
