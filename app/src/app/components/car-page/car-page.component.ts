import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../Interfaces/car';
import { AsyncPipe } from '@angular/common';
import { NgIf, NgFor, NgClass} from '@angular/common';
import { NgStyle } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.scss'
})
export class CarPageComponent {
  cars?:Observable<Car[]>; 
  isAdmin:boolean = false;
  pages = Array(5);
  currentPage:number = 0;
  SelectedRow:number = -1;

  ngOnInit(){
    if(localStorage.getItem("AdminKey") != null){
      this.isAdmin = true;
    }
    this.isAdmin = true;
    this.GetCars();
  }

  GetCars(){
    let cars:Car[] = []
    for (let i = 0; i < 10; i++) {
        let car:Car = {} as Car;
        car.Make = "volvo";
        car.Model = "2024";
        car.Plate = "Sick";
        car.VinNumber = "304"
        cars.push(car);
    }
    this.cars = of(cars);
  }

  SelectRow(index:number, event:Event){
    event.stopPropagation();
    if(this.SelectedRow == index){
      this.SelectedRow = -1;
      return;
    }
    else{
      this.SelectedRow = index;
    }
  }
}
