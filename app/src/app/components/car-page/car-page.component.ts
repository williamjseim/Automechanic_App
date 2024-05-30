import { Component, ElementRef, Input, ViewChild, viewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../Interfaces/car';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NgIf, NgFor, NgClass} from '@angular/common';
import { NgStyle } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CarDataService } from '../../services/car-data.service';
import { Issue } from '../../Interfaces/issue';
import {MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteRequestPopupComponent } from '../delete-request-popup/delete-request-popup.component';
@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, DeleteRequestPopupComponent, RouterLink, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.scss'
})
export class CarPageComponent {

  constructor(private carHttp:CarDataService){}

  cars?:Car[];
  isAdmin:boolean = false;
  pages:number = 0;
  currentPage:number = 0;
  SelectedRow:number = -1;
  itemsPrPage:number = 10;

  ngOnInit(){
    if(localStorage.getItem("AdminKey") != null){
      this.isAdmin = true;
    }
    this.isAdmin = true;
    this.GetCarPages(this.itemsPrPage);
    this.RemoveFilters();
  }

  searchForm = new FormGroup ({
    make: new FormControl(),
    model: new FormControl(),
    plate: new FormControl(),
    vinnr: new FormControl()
  })

  //gets filtered cars from server
  Search(){
    let make = this.searchForm.controls.make.value;
    let model = this.searchForm.controls.model.value;
    let plate = this.searchForm.controls.plate.value;
    let vin = this.searchForm.controls.vinnr.value;
    console.log(make, model, plate, vin);
    this.GetCarsHttp(make, model, plate, vin)
    this.SelectedRow = -1;
  }

  // stops click event from going to the parent of the element and either opens or closes a car row so some issues are visible
  SelectRow(index:number, event:Event){
    event.stopPropagation();
    if(this.SelectedRow == index){
      this.SelectedRow = -1;
      return;
    }
    else{
      this.GetCarIssuesHttp(this.cars![index].id).subscribe({next:(value)=>{
        this.cars![index].issues = value.body;
      }});
      this.SelectedRow = index;
    }
  }

  RemoveCar(index:number){
      let car = this.cars![index];
      this.carHttp.DeleteCar(car.id).subscribe({next:(value)=>{
        this.cars?.splice(index, 1);
      }});
  }

  RemoveFilters(){
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.model.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.vinnr.reset("");
    this.Search();
  }

  ChangeNumberPrPage(number:Event){
    this.itemsPrPage = JSON.parse((number.target as HTMLSelectElement).value)
    this.currentPage = 0;
    this.GetCarPages(this.itemsPrPage);
    this.Search();
  }

  //gets 10 from  cars from database
  private GetCarsHttp(make:string='', model:string='', plate:string='', vin:string = ''){
    this.carHttp.GetCars(this.currentPage, this.itemsPrPage, make, model, plate, vin).subscribe({next:(value)=>{
      this.cars = value;
    }});
  }

  //gets issues for a specific car
  private GetCarIssuesHttp(carId:string):Observable<any>{
    return this.carHttp.GetIssues(carId, 0, 3);
  }

  //gets how many pages of cars that are in the database
  private GetCarPages(amountPrPage:number){
    this.carHttp.GetPageAmount(amountPrPage).subscribe({next:(value)=>{
      this.pages = value;
    }});
  }

  JumpToPage(index:number){
    console.log(index);
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    this.Search();
  }
}
