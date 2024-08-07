import { Component } from '@angular/core';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
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
import { Car } from '../../../Interfaces/car';
import { CarDataService } from '../../../services/car-data.service';
import { Category } from '../../../Interfaces/category';
import { LoginService } from '../../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';


/**
 * CreateCarIssueComponent 
 * 
 * This component is responsible for providing a form to create a new issue for a car.
 * It allows users to select a car, choose a category, enter a price and description, and specify co-authors.
 * The component fetches available cars and categories from the service, initializes the form with query parameters if provided,
 * and handles form submission by navigating to a different route with encoded query parameters.
 */

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-car-issue',
  standalone: true,
  imports: [ProgressBarComponent, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIcon, MatButtonModule, CommonModule, MatSelectModule],
  templateUrl: './create-car-issue.component.html',
  styleUrl: './create-car-issue.component.scss'
})

export class CreateCarIssueComponent {

  carIssueForm = new FormGroup({
    car: new FormControl('', [Validators.required]),
    category: new FormControl(''),
    price: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    searchPlate: new FormControl(''),
    coAuthors: new FormControl<string[]>([]),
  });

  matcher = new MyErrorStateMatcher();
  loadingCars = false;
  loadingCategories = false;
  cars: Car[] = [];
  categories: Category[] = [];
  coAuthors:string[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarDataService,
    private userHttp: LoginService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getCars();
    this.getCategories()
    this.getQueryParam();
  }

  getCars() {
    this.loadingCars = true;
    this.carService.GetCars(0, 20)
      .subscribe(res => {
        this.cars = res;
        this.loadingCars = false;
      });
  }
  getCategories() {
    this.loadingCategories = true;
    this.carService.GetCarCategories()
      .subscribe(res => {
        this.categories = res;
        this.loadingCategories = false;
      });
  }

  getQueryParam() {

    this.route.queryParams.subscribe({
      next: (value) => {
        const carId = value['carId'];
        const car = value['car'];
        const category = value['category'];
        const price = value['price'];
        const description = value['description'];
        const coAuthors = value['coAuthors']
        if (carId) {
          this.patchCarSelect(carId);
        }
        if (car) 
          this.carIssueForm.controls.car.patchValue(JSON.parse(atob(car)));
        if (category) 
          this.carIssueForm.controls.category.patchValue(JSON.parse(atob(category)));
        if (price) 
          this.carIssueForm.controls.price.setValue(atob(price));
        if (description) 
          this.carIssueForm.controls.description.setValue(atob(description));
        if(coAuthors) {
          let parsedCoAuthors = JSON.parse(atob(coAuthors));
          this.carIssueForm.controls.coAuthors.patchValue(parsedCoAuthors);
          this.coAuthors = parsedCoAuthors;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });

  }
  compareItem(item1: any, item2: any) {
    return item1 && item2 && item1.id === item2.id;
  }


  patchCarSelect(carId: string) {
    this.carService.GetCar(carId).subscribe({
      next: (res) => {
        this.carIssueForm.controls.car.patchValue(res);
        this.carIssueForm.controls.car.disable();
      },
      error: () => {

      },
    });
  }
  onSubmit() {
    if (this.carIssueForm.valid) {
      
      let car = JSON.stringify(this.carIssueForm.controls.car.getRawValue());
      let category = JSON.stringify(this.carIssueForm.controls.category.getRawValue());
      let price = this.carIssueForm.controls.price.getRawValue();
      let description = this.carIssueForm.controls.description.getRawValue();
      let coAuthors = JSON.stringify(this.carIssueForm.controls.coAuthors.getRawValue());

      this.router.navigate(['submit'], { relativeTo: this.route, queryParams: { 
        car: btoa(car),
        category: btoa(category),
        price: btoa(price!),
        description: btoa(description!),
        coAuthors: btoa(coAuthors),
      } });
    }
  }

  // TODO: Verify user existence with database
  // Entered username => 
  // check if username exist on database =>
  // if exist, add username to array
  AddUser(username:string){

    this.userHttp.DiscoverUser(username).subscribe({
      next: () => {
        this.coAuthors.push(username);
        this.carIssueForm.controls.coAuthors.reset(this.coAuthors)
      },

      error: () => {
        this.snackbar.open("User not found", 'close', { duration: 1500 })
      }
    })
    
  }
  
  RemoveUser(index:number){
    this.coAuthors.splice(index, 1);
    this.carIssueForm.controls.coAuthors.reset(this.coAuthors)
  }
}
