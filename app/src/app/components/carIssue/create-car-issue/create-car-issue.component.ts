import { Component, OnInit } from '@angular/core';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { VideoApiService } from '../../../services/video-api.service';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-car-issue',
  standalone: true,
  imports: [ProgressBarComponent, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIcon, MatSelectModule],
  templateUrl: './create-car-issue.component.html',
  styleUrl: './create-car-issue.component.scss'
})
export class CreateCarIssueComponent {
  carIssueForm = new FormGroup({
    car: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  })
  // priceFormControl = new FormControl('', [Validators.required]);
  // descriptionFormControl = new FormControl('');
  // selectFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  // mock car data
  cars: any[] = [
    { id: "be93ef1e-5f98-4926-a785-e96e8482bc84", model: "API Test", make: "Has GUID", plate: "XY 29 381" },
    { model: "c40", plate: "ZB 40 432", make: "volvo" },
    { model: "c40", plate: "AH 34 137", make: "volvo" },
    { model: "golf", plate: "EG 28 126", make: "volkswagen" },

  ]

  testUrl: string = "assets/20240521110232-video.mp4"
  videoUrl: string | ArrayBuffer | null = null;

  constructor(
    public videoService: VideoApiService,
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    const file = this.sharedService.getVideo();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.videoUrl = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.carIssueForm.valid) {
      this.sharedService.setCarIssueData(this.carIssueForm.value);
      this.router.navigate(['submit'], {relativeTo:this.route})
    }
  }
  onCancel() {
    // Navigate back to the previous page
    this.router.navigateByUrl('record');
  }
}
