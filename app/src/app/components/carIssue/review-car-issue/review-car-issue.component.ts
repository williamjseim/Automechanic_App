import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewIssue } from '../../../Interfaces/newIssue';
import { CarDataService } from '../../../services/car-data.service';
import { MatSnackBar } from '@angular/material/snack-bar'
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
    private route:ActivatedRoute,
    public sharedService: SharedService,
    private carService: CarDataService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    let id = this.route.params.subscribe({
      next:(value)=>{
        let id = value["issueId"];
      }
    })
    this.getFormData();
  }

  getFormData() {    
    this.formData = this.sharedService.getFormData();
    console.log(this.formData?.coAuthors)
    if (!this.formData) {
      this.router.navigateByUrl("/issue");
    }
  }

  // Navigate to the previous page
  onCancel() {
    this.router.navigate(['issue']); 
  }

  // Handle the accept action
  onAccept() {
    this.loading = true;
    this.carService.CreateIssue(this.formData?.car.id!, this.formData?.category?.id, this.formData?.description!, this.formData?.price!, this.formData?.coAuthors).subscribe({
      next: (res) => { 
        this.loading = false;
        this.sharedService.setFormData(null);
        this.snackbar.open('Issue created', 'Close', { duration: 4000 });
        this.router.navigate(['issueprofile'], { queryParams: {issueId: res}});
      },
      error: (err) => { 
        console.log(err);
      },
    });
  }
}
