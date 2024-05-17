import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../Interfaces/car';
import { AsyncPipe } from '@angular/common';
import { NgIf, NgFor, NgClass} from '@angular/common';
import { NgStyle } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CarDataService } from '../../services/car-data.service';
import { Issue } from '../../Interfaces/issue';
@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.scss'
})
export class CarPageComponent {

  constructor(private carHttp:CarDataService){}

  cars?:Car[]; 
  isAdmin:boolean = false;
  pages = Array(5);
  currentPage:number = 0;
  SelectedRow:number = -1;

  ngOnInit(){
    if(localStorage.getItem("AdminKey") != null){
      this.isAdmin = true;
    }
    this.isAdmin = true;
    this.GetCarsHttp().subscribe({next:(value)=>{
      this.cars = value;
    }});
  }

  SelectRow(index:number, event:Event){
    event.stopPropagation();
    if(this.SelectedRow == index){
      this.SelectedRow = -1;
      return;
    }
    else{
      this.GetCarIssuesHttp(this.cars![index].id).subscribe({next:(value)=>{
        this.cars![index].issues = value;
        console.log(value);
      }});
      this.SelectedRow = index;
    }
  }

  private GetCarsHttp():Observable<Car[]>{
    return this.carHttp.GetCars(0, 10);
  }

  private GetCarIssuesHttp(carId:string):Observable<Issue[]>{
    return this.carHttp.GetIssues(carId, 0);
  }
}
