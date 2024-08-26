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
  templateUrl: './anonymous-preview.component.html',
  styleUrl: './anonymous-preview.component.scss'
})
export class AnonymousPreviewComponent implements OnInit {

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
        var issueId = value['issueId'];
        var anonymousKey = value['anonymousKey'];
        
        this.getIssue(issueId, anonymousKey);
        this.getVideo(issueId);
      },
      error: (error) => {
        this.issueNotFound = true;
        this.loading = false;
        this.router.navigate(['/cars'])
      }
    });
  }

  getIssue(issueId: string, anonymousKey: string) {
    this.carHttp.GetAnonoymousIssue(issueId, anonymousKey).subscribe({
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

        if (this.video == null || this.video.length <= 0)
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

  videoStream?: Blob;

  createVideoObject() {
    this.video?.forEach(i => {
      this.videoHttp.getVideoStream(i.id).subscribe({
        next: (Event: HttpEvent<ArrayBuffer>) => {
          if (Event.type == HttpEventType.Response) {
            this.videoStream = new Blob([Event.body!], { type: "video/mp4" });
            this.videos.push(URL.createObjectURL(this.videoStream!));
          }
        },
        error: (err) => {
          this.videoNotFound = true;
          console.log(err);
        }
      });
    });
  }
}
