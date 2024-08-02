import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../../Interfaces/car';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { NgIf, NgFor, NgClass} from '@angular/common';
import { NgStyle } from '@angular/common';
import { CarDataService } from '../../services/car-data.service';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteRequestPopupComponent } from '../delete-request-popup/delete-request-popup.component';
import { TablePrefabComponent } from '../Prefabs/table-prefab/table-prefab.component';
import { ColumnDefDirective } from '../../Directives/column-def.directive';
import { MatInputModule } from '@angular/material/input';


/**
 * CarPageComponent
 * 
 * This component manages and displays a paginated list of cars.
 * It allows searching, filtering, and pagination of car data.
 * Additionally, it handles operations such as deleting cars and viewing car issues.
 */

@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [TablePrefabComponent, NgClass, ColumnDefDirective, NgTemplateOutlet, DatePipe, DeleteRequestPopupComponent, RouterLink, ReactiveFormsModule, FormsModule, MatInputModule, NgIf, NgFor, NgStyle, NgClass],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.scss',
})
export class CarPageComponent {

  constructor(private carHttp:CarDataService){}

  cars?:Car[];
  isAdmin?:Observable<boolean>;
  pages:number = 1;
  currentPage:number = 0;
  SelectedRow:number = -1;
  itemsPrPage:number = 10;

  ngOnInit(){
    this.RemoveFilters();
  }
    
  searchForm = new FormGroup ({
    creator: new FormControl(),
    make: new FormControl(),
    model: new FormControl(),
    plate: new FormControl(),
    vinnr: new FormControl()
  })

  //gets filtered cars from server
  Search(){
    let creator = this.searchForm.controls.creator.value;
    let make = this.searchForm.controls.make.value;
    let model = this.searchForm.controls.model.value;
    let plate = this.searchForm.controls.plate.value;
    let vin = this.searchForm.controls.vinnr.value;

    this.GetCarsHttp(make, creator, model, plate, vin)
    this.GetCarPages(this.itemsPrPage, make, model, plate, vin);
    this.SelectedRow = -1;
  }

  StopPropagation(event: Event) {
    console.log("Stopped propagation");
    event.stopPropagation();
  }

  DrawerOpened(index:number){
    if(this.cars![index].issues == null){
      this.GetCarIssuesHttp(this.cars![index].id).subscribe({
          next:(value)=>{
            if(value.status == 200){
              this.cars![index].issues = value.body;
            }
          else{
            this.cars![index].issues = [];
          }
        }
      });
    }
  }

  RemoveCar(index:number){
    let car = this.cars![index];
    this.carHttp.DeleteCar(car.id).subscribe({next:(value)=>{
      this.cars?.splice(index, 1);
      this.Search();
    }});
  }

  RemoveFilters(){
    this.searchForm.controls.creator.reset("");
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.model.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.vinnr.reset("");
    this.Search();
  }

  ChangeNumberPrPage(number:number){
    this.itemsPrPage = number;
    this.currentPage = 0;
    this.GetCarPages(this.itemsPrPage);
    this.Search();
  }

  //gets 10 from  cars from database
  private GetCarsHttp(make:string='', creator:string = "", model:string='', plate:string='', vin:string = ''){
    this.carHttp.GetCars(this.currentPage, this.itemsPrPage, creator, make, model, plate, vin).subscribe({
    next:(value)=>{
      this.cars = value;
    },
    error:(err)=>{
      this.cars = [];
    }
  });
  }

  //gets issues for a specific car
  private GetCarIssuesHttp(carId:string):Observable<any>{
    return this.carHttp.GetCarIssues(carId, 0, 3);
  }

  //gets how many pages of cars that are in the database
  private GetCarPages(amountPrPage: number, make: string = "", model: string = "", plate: string = "", vin: string = ""){
    this.carHttp.GetPageAmount(amountPrPage, make, model, plate, vin).subscribe({next:(value)=>{
      let asd = localStorage.getItem("isadmin") ?? "false";
      this.isAdmin = of(JSON.parse(asd) as boolean);
      this.pages = value;
      if (this.currentPage >= this.pages) {
        this.currentPage = 0;
      }
    }});
  }

  JumpToPage(index:number){
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    this.Search();
  }

}
