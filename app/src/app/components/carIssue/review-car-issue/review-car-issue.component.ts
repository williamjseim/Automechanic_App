import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-review-car-issue',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatInputModule, ProgressBarComponent, NavBarComponent],
  templateUrl: './review-car-issue.component.html',
  styleUrl: './review-car-issue.component.scss'
})
export class ReviewCarIssueComponent {
  formData: any;
  videoUrl: string | ArrayBuffer | null = null;

  constructor(
    private router: Router,
    public sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    console.log(history.state);
    this.formData = this.sharedService.getCarIssueData();
    console.log(this.formData);
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

  onAccept() {
    // Handle the accept action (e.g., save data)
    console.log('Data accepted:', this.formData);
  }
}
