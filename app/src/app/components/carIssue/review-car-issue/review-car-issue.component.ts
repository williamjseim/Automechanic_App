import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarDataService } from '../../../services/car-data.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Car } from '../../../Interfaces/car';
import { Category } from '../../../Interfaces/category';
@Component({
  selector: 'app-review-car-issue',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatInputModule, ProgressBarComponent, NavBarComponent, MatProgressSpinnerModule],
  templateUrl: './review-car-issue.component.html',
  styleUrl: './review-car-issue.component.scss'
})
export class ReviewCarIssueComponent implements OnInit {

  car!: Car;
  category: Category | undefined;
  price: number | undefined;
  description: string | undefined;
  coAuthors: string[] | undefined;
  loading = false;

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private carService: CarDataService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getQueryParam();
  }

  getQueryParam() {
    this.route.queryParams.subscribe({
      next: (value) => {
        this.car = JSON.parse(atob(value['car'])) as Car;
        this.category = JSON.parse(atob(value['category'])) as Category;
        this.price = parseInt(atob(value['price'])) as number;
        this.description = atob(value['description']) as string;
        this.coAuthors = JSON.parse(atob(value['coAuthors'])) as string[];
      }
    })
  }

  // Navigate to the previous page
  onCancel() {
    let car = JSON.stringify(this.car);
    let category = JSON.stringify(this.category);

    this.router.navigate(['issue'], { queryParams: {
      car: btoa(car),
      category: btoa(category),
      price: btoa(this.price!.toString()),
      description: btoa(this.description!),
      coAuthors: btoa(JSON.stringify(this.coAuthors))
    }}); 
  }

  // Handle the accept action
  onAccept() {
    this.loading = true;
    this.carService.CreateIssue(this.car.id, this.category?.id, this.description!, this.price!, this.coAuthors).subscribe({
      next: (res) => { 
        this.loading = false;
        this.snackbar.open('Issue created', 'Close', { duration: 4000 });
        this.router.navigate(['issueprofile'], { queryParams: {issueId: res}});
      },
      error: (err) => { 
        console.log(err);
      },
    });
  }
}
