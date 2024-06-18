import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { VideoApiService } from '../../services/video-api.service';

@Component({
  selector: 'app-video-capture',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProgressBarComponent, NavBarComponent],
  templateUrl: './video-capture.component.html',
  styleUrl: './video-capture.component.scss'
})
export class VideoCaptureComponent {

  @Input() issueId?: string;
  @Output() uploadStatus = new EventEmitter<{ success: boolean, message: string }>();
  videoFile!: File;

  constructor(
    private videoHttp: VideoApiService
  ) { }
  openCamera() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.capture = 'camcorder';
    input.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.videoFile = target.files[0];
        this.sendVideoToAPI();
      }
    });
    input.click();
  }

  selectVideo() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.videoFile = file;
      this.sendVideoToAPI();
    }
  }

  sendVideoToAPI() {
    if (!this.issueId) {
      console.log("Record component does not have an issueId");
      return;
    }
    const formData = new FormData();
    formData.append('video', this.videoFile);

    this.videoHttp.uploadVideo(this.issueId ,formData).subscribe({
      next: (res) => {
        this.uploadStatus.emit({success: true, message: res});
      },
      error: (err) => {
        this.uploadStatus.emit({ success: false, message: err });
      }
    });
  }
}
