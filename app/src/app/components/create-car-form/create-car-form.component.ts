import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, matFormFieldAnimations} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-car-form',
  standalone: true,
  imports: [MatSelectModule, MatIconModule, MatButtonModule, MatInput, MatInputModule, MatFormFieldModule],
  templateUrl: './create-car-form.component.html',
  styleUrl: './create-car-form.component.scss'
})
export class CreateCarFormComponent {
  @ViewChild('make') make!:ElementRef<HTMLInputElement>;
  @ViewChild('model') model!:ElementRef<HTMLInputElement>;
  @ViewChild('plate') plate!:ElementRef<HTMLInputElement>;
  @ViewChild('vin') vin!:ElementRef<HTMLInputElement>;

  CreateCar(){
    let make = this.make.nativeElement.value;
    let model = this.model.nativeElement.value;
    let plate = this.plate.nativeElement.value;
    let vin = this.vin.nativeElement.value;
    //add html here
  }
  
}
