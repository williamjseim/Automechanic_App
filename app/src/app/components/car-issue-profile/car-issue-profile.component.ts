import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../../Interfaces/issue';
import { ActivatedRoute } from '@angular/router';
import { CarDataService } from '../../services/car-data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-car-issue-profile',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatInputModule, RouterLink],
  templateUrl: './car-issue-profile.component.html',
  styleUrl: './car-issue-profile.component.scss'
})
export class CarIssueProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private carHttp: CarDataService,
  ) {}
  issue?: Issue;
  loading: boolean = false;
  issueNotFound: boolean = false;
  ngOnInit() {
    
    this.loading = true;
    this.route.queryParams.subscribe({
      next: (value) => {
        let issueId = value['issueId']
        this.carHttp.GetIssue(issueId).subscribe({
          next: (issue) => {
            this.issue = issue;
            this.loading = false
          },
          error: (error) => {
            this.issueNotFound = true;
            this.loading = false
          }
        })
      },
      error: (error) => {
        this.issueNotFound = true;
        this.loading = false;
      }
    });
  }
}
