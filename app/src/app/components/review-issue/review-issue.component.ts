import { Component, OnInit } from '@angular/core';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { VideoApiService } from '../../services/video-api.service';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-review-issue',
  standalone: true,
  imports: [ProgressBarComponent, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './review-issue.component.html',
  styleUrl: './review-issue.component.scss'
})
export class ReviewIssueComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  makeFormControl = new FormControl('', [Validators.required]);
  modelFormControl = new FormControl('', [Validators.required]);
  otherFormControl = new FormControl('', [Validators.required]);
  anotherFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  testUrl: string = "assets/20240521110232-video.mp4"
  videoUrl: string | ArrayBuffer | null = null;
  
  constructor(public videoService: VideoApiService) {}


  ngOnInit(): void {
    const file = this.videoService.getVideo();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.videoUrl = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
