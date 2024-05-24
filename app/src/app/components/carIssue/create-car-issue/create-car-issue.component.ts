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
import { SharedService } from '../../../services/shared.service';
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
    description: new FormControl('', [Validators.required]),
    searchPlate: new FormControl(''),
  });

  matcher = new MyErrorStateMatcher();
  loading = false;

  cars: Car[] = [];
    
  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarDataService
  ) { }

  ngOnInit(): void {

    this.getCars();
    const savedData = this.sharedService.getFormData();
    if (savedData) {
      this.carIssueForm.patchValue(savedData);
    }
  }

  getCars() {
    this.loading = true;
    const cars: Car[] = this.sharedService.getCars();
    if (cars.length > 0) {
      this.cars = cars;
      this.loading = false;
    }
    else {
      this.carService.GetCars(0, 5000)
      .subscribe(res => {
        this.cars = res;
        this.sharedService.setCars(this.cars);
        this.loading = false;
      });
    }
  }

  // 
  compareCars(car1: any, car2: any) {
    console.log(car1);
    console.log(car2);
    return car1 && car2 && car1.id === car2.id;
  }

  onSubmit() {
    if (this.carIssueForm.valid) {
      this.sharedService.setFormData(this.carIssueForm.value);
      this.router.navigate(['submit'], { relativeTo: this.route });
    }
  }

  onCancel() {
    // Navigate back to the previous page
    this.router.navigateByUrl('record');
  }
}
