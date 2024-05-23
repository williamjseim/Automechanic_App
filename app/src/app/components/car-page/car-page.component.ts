import { Component, ElementRef, Input, ViewChild, viewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../Interfaces/car';
import { AsyncPipe } from '@angular/common';
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
@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [AsyncPipe, RouterLink, MatIconModule, MatButtonModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.scss'
})
export class CarPageComponent {

  constructor(private carHttp:CarDataService){}

  cars?:Car[];
  isAdmin:boolean = false;
  pages?:any[];
  currentPage:number = 0;
  SelectedRow:number = -1;
  CarForDeletion:number = -1;
  itemsPrPage:number = 10;
  deleteError = "";

  @ViewChild('MakeFilter', {read: ElementRef, static: false}) makefilter!: ElementRef<HTMLInputElement>
  @ViewChild('ModelFilter', {read: ElementRef, static: false}) modelFilter!:ElementRef<MatInput>;
  @ViewChild('PlateFilter', {read: ElementRef, static: false}) plateFilter!:ElementRef<MatInput>;
  @ViewChild('VinFilter', {read: ElementRef, static: false}) vinFilter!:ElementRef<MatInput>;

  ngOnInit(){
    if(localStorage.getItem("AdminKey") != null){
      this.isAdmin = true;
    }
    this.isAdmin = true;
    this.GetCarsHttp();
    this.GetCarPages(this.itemsPrPage);
  }

  Search(){
    let make = this.makefilter.nativeElement.value ?? "";
    let model = this.modelFilter.nativeElement.value ?? "";
    let plate = this.plateFilter.nativeElement.value ?? "";
    let vin = this.vinFilter.nativeElement.value ?? "";
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

  OpenDeleteDialog(index:number){
    this.CarForDeletion = index;
  }

  RemoveCar(confirmText:string){
    if(confirmText == "Delete"){
      let car = this.cars![this.CarForDeletion];
      this.DeleteCar(car.id);
      this.cars?.splice(this.CarForDeletion, 1);
      this.CarForDeletion = -1;
      this.deleteError = "";
    }
    else{
      this.deleteError = "Wrong input"
    }
  }

  RemoveFilters(){
    this.makefilter.nativeElement.value = "";
    this.modelFilter.nativeElement.value = "";
    this.plateFilter.nativeElement.value = "";
    this.vinFilter.nativeElement.value = "";
    this.Search();
  }

  ChangeNumberPrPage(){
    this.currentPage = 0;
    this.Search();
  }

  Test(text:string){
    console.log(text);
  }

  //gets 10 from  cars from database
  private GetCarsHttp(make:string="", model:string="", plate:string="", vin:string = ""){
    this.carHttp.GetCars(this.currentPage*this.itemsPrPage, this.itemsPrPage, make, model, plate, vin).subscribe({next:(value)=>{
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
      this.pages = Array(value);
    }});
  }

  private DeleteCar(carId:string){
    this.carHttp.DeleteCar(carId).subscribe({next:(value)=>{
    }});
  }
}
