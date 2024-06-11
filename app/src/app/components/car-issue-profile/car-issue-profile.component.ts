import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../../Interfaces/issue';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDataService } from '../../services/car-data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { VideoCaptureComponent } from '../video-capture/video-capture.component';
import { VideoApiService } from '../../services/video-api.service';
import { Video } from '../../Interfaces/video';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-car-issue-profile',
  standalone: true,
  imports: [VideoCaptureComponent, CommonModule, MatProgressSpinnerModule, MatInputModule, RouterLink],
  templateUrl: './car-issue-profile.component.html',
  styleUrl: './car-issue-profile.component.scss'
})
export class CarIssueProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carHttp: CarDataService,
    public videoHttp: VideoApiService,
  ) { }

  issue?: Issue;
  video?: Video[]; 
  videos: string[] = [];
  loading: boolean = false;
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

createVideoObject() {
  this.video?.forEach(i => {
    this.videoHttp.getVideoStream(i.id).subscribe({
      next: (value) => {
        const blob = new Blob([value]);
        this.videos.push(URL.createObjectURL(blob));
      },
    });
  });
  }

  handleVideoUpload(event: { success: boolean, message: string }) {
    if (event.success) {
      this.getVideo(this.issue?.id!);
    }
    else {
      console.log("Upload failed: ", event.message);
    }
  }
}
