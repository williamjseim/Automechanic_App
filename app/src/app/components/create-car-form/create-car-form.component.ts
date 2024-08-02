import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CarDataService } from '../../services/car-data.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * CreateCarFormComponent 
 * 
 * This component provides a form for creating a new car record. 
 * It includes fields for make, model, plate, and VIN number, with validation to ensure that all fields are filled out.
 * Upon successful form submission, it interacts with the `CarDataService` to create the car record and navigates to the 'cars' page.
 * Errors are displayed using a snack bar.
 */
@Component({
  selector: 'app-create-car-form',
  standalone: true,
  imports: [MatSelectModule, MatIconModule, MatButtonModule, MatInput, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './create-car-form.component.html',
  styleUrl: './create-car-form.component.scss'
})
export class CreateCarFormComponent {
  constructor(
    private carhttp:CarDataService, 
    private router:Router,
    private snackbar: MatSnackBar
  ) {}

  errortext:string = "";
  carform = new FormGroup ({
    make: new FormControl(),
    model: new FormControl(),
    plate: new FormControl(),
    vinnr: new FormControl()
  })

  ngOnInit(){
    this.carform.controls.make.addValidators([Validators.required])
    this.carform.controls.model.addValidators([Validators.required])
    this.carform.controls.vinnr.addValidators([Validators.required])
    this.carform.controls.plate.addValidators([Validators.required])
  }

  CreateCar(){
    let make = this.carform.controls.make.value;
    let model = this.carform.controls.model.value;
    let plate = this.carform.controls.plate.value;
    let vin = this.carform.controls.vinnr.value;
    //add html here
    if(this.carform.valid){
      this.carhttp.CreateCar(make, model, plate, vin).subscribe({
        next:(value)=>{
          console.log(value);
          this.snackbar.open(value.value, 'Close', { duration: 3000 });
          this.router.navigate(['cars']);
        },
        error:(err)=>{
          this.errortext = err.error.value;
        }
      })
    }
    else{

    }
  }
}
