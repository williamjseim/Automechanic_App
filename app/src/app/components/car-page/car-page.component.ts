import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../Interfaces/car';
import { AsyncPipe } from '@angular/common';
import { NgIf, NgFor} from '@angular/common';
import { NgStyle } from '@angular/common';
@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgStyle],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.scss'
})
export class CarPageComponent {
  cars?:Observable<Car[]>; 
  isAdmin:boolean = false;

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
}
