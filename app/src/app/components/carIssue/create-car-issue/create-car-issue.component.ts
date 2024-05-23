import { Component } from '@angular/core';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { VideoApiService } from '../../../services/video-api.service';
import { CommonModule } from '@angular/common';
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
import { NewIssue } from '../../../Interfaces/newIssue';
import { Car } from '../../../Interfaces/car';
import { CarDataService } from '../../../services/car-data.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-car-issue',
  standalone: true,
  imports: [ProgressBarComponent, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIcon, CommonModule, MatSelectModule],
  templateUrl: './create-car-issue.component.html',
  styleUrl: './create-car-issue.component.scss'
})
export class CreateCarIssueComponent {
  carIssueForm = new FormGroup({
    car: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  matcher = new MyErrorStateMatcher();
  loading = false;

  cars: any[] = [];

  testUrl: string = "assets/20240521110232-video.mp4";
  videoUrl: string | ArrayBuffer | null = null;

  constructor(
    public videoService: VideoApiService,
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarDataService
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

    this.loading = true;
    this.carService.GetCars(0, 5000)
      .subscribe(res => {
        this.cars = res;
        this.loading = false;
      });
  }

  onSubmit() {
    if (this.carIssueForm.valid) {

      const formValue = this.carIssueForm.value;

      const newIssue: NewIssue = {
        car: formValue.car as unknown as Car,
        price: Number(formValue.price),
        description: formValue.description as string,
      };

      this.sharedService.setCarIssueData(newIssue);
      this.router.navigate(['submit'], { relativeTo: this.route });
    }
  }

  onCancel() {
    // Navigate back to the previous page
    this.router.navigateByUrl('record');
  }
}
