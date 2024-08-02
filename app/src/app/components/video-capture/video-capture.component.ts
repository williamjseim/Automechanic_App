import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { VideoApiService } from '../../services/video-api.service';

/**
 * VideoCaptureComponent
 * 
 * This component provides functionality for capturing and uploading video files.
 * It allows users to open their camera or select a video file from their device, and
 * then sends the selected video to an API service. The component emits events to indicate 
 * the start of video upload and the status of the upload process.
 */

@Component({
  selector: 'app-video-capture',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProgressBarComponent, NavBarComponent],
  templateUrl: './video-capture.component.html',
  styleUrl: './video-capture.component.scss'
})
export class VideoCaptureComponent {

  @Input() issueId?: string; // Optional input for issue ID to associate with the video

  @Output() videoUploadStart = new EventEmitter<boolean>(); // Event emitted when video upload starts

  @Output() uploadStatus = new EventEmitter<{ success: boolean, message: string }>(); // Event emitted with upload status

  videoFile!: File; // Holds the selected video file

  constructor(
    private videoHttp: VideoApiService
  ) { }

  /**
 * Opens the device's camera to capture a video.
 * Creates an input element of type file with video capture settings,
 * and triggers a change event to process the selected video file.
 */
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

  /**
   * Opens the file input element for selecting a video file.
   * Resets the file input value to allow re-selection of the same file.
   */
  selectVideo() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }

  /**
 * Handles the file selection event.
 * Updates the videoFile property with the selected file and sends the video to the API.
 * @param event The file input change event
 */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.videoFile = file;
      this.sendVideoToAPI();
    }
  }

  /**
 * Sends the selected video file to the API for upload.
 * Emits the videoUploadStart event, and upon completion, emits the uploadStatus event
 * with success or error information.
 */
  sendVideoToAPI() {
    if (!this.issueId) {
      console.log("Record component does not have an issueId");
      return;
    }
    const formData = new FormData();
    formData.append('video', this.videoFile);

    this.videoUploadStart.emit();

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
