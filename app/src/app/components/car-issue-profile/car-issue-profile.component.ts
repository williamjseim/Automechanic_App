import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../../Interfaces/issue';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDataService } from '../../services/car-data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { VideoCaptureComponent } from '../video-capture/video-capture.component';
import { VideoApiService } from '../../services/video-api.service';
import { Video } from '../../Interfaces/video';
import { environment } from '../../../environments/environment';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
/**
 * CarIssueProfileComponent
 * 
 * This component manages the detailed view of a specific car issue, including displaying issue details
 * and handling associated videos. It retrieves and displays information about the issue and related videos.
 * Video can be uploaded to the issue if there is nothing.
 * 
 */
@Component({
  selector: 'app-car-issue-profile',
  standalone: true,
  imports: [VideoCaptureComponent, CommonModule, MatProgressSpinnerModule, MatInputModule, RouterLink, MatIcon],
  templateUrl: './car-issue-profile.component.html',
  styleUrl: './car-issue-profile.component.scss'
})
export class CarIssueProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carHttp: CarDataService,
    public videoHttp: VideoApiService,
    private snackbar: MatSnackBar,
    private clipboard: Clipboard
  ) { }

  issue?: Issue;
  video?: Video[]; 
  videos: string[] = [];
  loading: boolean = false;
  uploadingVideo: boolean = false;
  loadingVideo: boolean = false;
  videoNotFound: boolean = false;
  issueNotFound: boolean = false;

  environment_API: string = environment.API_URL; // For video streaming directly on the html template
  
  ngOnInit() {
    this.loading = true;
    this.route.queryParams.subscribe({
      next: (value) => {
        this.getIssue(value['issueId']);
        this.getVideo(value['issueId']);
      },
      error: (error) => {
        this.issueNotFound = true;
        this.loading = false;
        this.router.navigate(['/cars'])
      }
    });
  }

  getIssue(issueId: string) {
    this.carHttp.GetIssue(issueId).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.loading = false;
        if (issue == null) {
          this.router.navigate(['/cars'])
        }
      },
      error: (error) => {
        this.issueNotFound = true;
        this.loading = false
        this.router.navigate(['/cars'])
      }
    });
  }

  getVideo(issueId: string) {
    this.loadingVideo = true;
    this.videos = [];
    this.videoHttp.getVideo(issueId).subscribe({
      next: (video) => {
        this.video = video;
        this.createVideoObject();

        if (this.video == null || this.video.length <= 0 )
          this.videoNotFound = true;
        else
          this.videoNotFound = false;
             
        this.loadingVideo = false;
      },
      error: (error) => {
        this.videoNotFound = true;
        this.loadingVideo = false;
      }
    });
  }

videoStream?:Blob;

createVideoObject() {
  this.video?.forEach(i => {
    this.videoHttp.getVideoStream(i.id).subscribe({
      next: (Event)=>{
          this.videoStream = new Blob([Event], {type:"video/mp4"});
          this.videos.push(URL.createObjectURL(this.videoStream!));
        
      },
      error: (err) => {
        this.videoNotFound = true;
        console.log(err);
      }
    });
  });
  }

  videoStartUpload() {
    this.uploadingVideo = true;
  }

  handleVideoUpload(event: { success: boolean, message: string }) {
    if (event.success) {
      this.uploadingVideo = false;
      this.getVideo(this.issue?.id!);
    }
    else {
      console.log("Upload failed: ", event.message);
    }
  }

  completeIssue() { 
    this.carHttp.ChangeIssueStatus(this.issue?.id!).subscribe({
      next: (value) => { 
        this.getIssue(this.issue?.id!);
         window.scroll({ top: 0, left: 0, behavior: 'smooth'});
      },
      error: (err) => { }
    })
  }

  createShareLink() {
    this.carHttp.CreateAnonymousIssue(this.issue?.id!).subscribe({
      next: (value) => {
        const snackbarRef = this.snackbar.open('Share link created', 'copy', { duration: 999999})
        
        snackbarRef.onAction().subscribe(() => {
          const link = `${window.location.origin}/issuepreview?issueId=${this.issue?.id}&anonymousKey=${value.anonymousUserKey}`
          this.clipboard.copy(link);
          this.snackbar.open('Link copied to clipboard!', '', { duration: 2000 });
        });
      }
    })

  }
}
