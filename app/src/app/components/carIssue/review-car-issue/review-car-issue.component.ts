import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewIssue } from '../../../Interfaces/newIssue';
import { CarDataService } from '../../../services/car-data.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-review-car-issue',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatInputModule, ProgressBarComponent, NavBarComponent, MatProgressSpinnerModule],
  templateUrl: './review-car-issue.component.html',
  styleUrl: './review-car-issue.component.scss'
})
export class ReviewCarIssueComponent implements OnInit {

  formData: NewIssue | null = null;
  videoUrl: string | ArrayBuffer | null = null;
  loading = false;

  constructor(
    private router: Router,
    public sharedService: SharedService,
    private carService: CarDataService
  ) { }

  ngOnInit(): void {
    this.formData = this.sharedService.getFormData();
    if (!this.formData) {
      // this.router.navigateByUrl("/issue");
    }
    const file = this.sharedService.getVideo();

    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.videoUrl = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onCancel() {
    this.router.navigate(['issue']); // Navigate to the home or previous page
  }

  // Handle the accept action
  onAccept() {

    this.loading = true;
    this.carService.CreateIssue(this.formData?.car.id!, this.formData?.description!, this.formData?.price!)
      .pipe(
        catchError(error => {
          // Handle the error
          console.error('An error occurred:', error);

          // Return an empty observable or a default value to suppress the error
          return of(null);  // You can change 'null' to an appropriate default value if needed
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
      next: () => this.loading = false,
      error: (err) => console.log(err),
      complete: () => console.info("completed issue request"),  
    })
  }
}
