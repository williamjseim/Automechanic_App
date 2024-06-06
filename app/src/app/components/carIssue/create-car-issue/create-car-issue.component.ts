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
    category: new FormControl(''), // TODO: Add required validator when implemented
    price: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    searchPlate: new FormControl(''),
  });

  matcher = new MyErrorStateMatcher();
  loading = false;

  cars: Car[] = [];
  categories: any = [{tag: 'Not Implemented', id: "Not Implemented"}];

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarDataService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getExistingData();
    this.getQueryParam();
  }

  async getData(): Promise<boolean> {
    this.loading = true;
      this.carService.GetCars(0, 20)
      .subscribe(res => {
        this.cars = res;
        this.loading = false;
        return true;
      });
      return false;
  }

  getExistingData() {
    const savedData = this.sharedService.getFormData();
    if (savedData)
      this.carIssueForm.patchValue(savedData);
  }
  getQueryParam() {

    this.route.queryParams.subscribe({
      next: (value) => {
        const carId = value['carId'];
        if (carId) {
          this.patchCarSelect(carId);
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
      this.sharedService.setFormData(this.carIssueForm.getRawValue());
      this.router.navigate(['submit'], { relativeTo: this.route });
    }
  }
}
