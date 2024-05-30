import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, matFormFieldAnimations} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CarDataService } from '../../services/car-data.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-car-form',
  standalone: true,
  imports: [MatSelectModule, MatIconModule, MatButtonModule, MatInput, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './create-car-form.component.html',
  styleUrl: './create-car-form.component.scss'
})
export class CreateCarFormComponent {
  constructor(private carhttp:CarDataService, private router:Router){}

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
    let make = this.carform.controls.make.value();
    let model = this.carform.controls.model.value();
    let plate = this.carform.controls.plate.value();
    let vin = this.carform.controls.vinnr.value();
    //add html here
    if(this.carform.valid){
      this.carhttp.CreateCar(make, model, plate, vin).subscribe({
        next:(value)=>{
          this.router.navigate(['cars']);
        },
        error:(err)=>{
          this.errortext = err;
        }
      })
    }
    else{

    }
  }
}
