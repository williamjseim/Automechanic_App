import { Component, Input } from '@angular/core';
import { CarDataService } from '../../../services/car-data.service';
import { Car } from '../../../Interfaces/car';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgIf, NgFor, NgStyle, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { DeleteRequestPopupComponent } from '../../delete-request-popup/delete-request-popup.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-prefab',
  standalone: true,
  imports: [AsyncPipe, DatePipe, DeleteRequestPopupComponent, RouterLink, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './table-prefab.component.html',
  styleUrl: './table-prefab.component.scss'
})
export class TablePrefabComponent {

  cars?:Car[];
  isAdmin?:Observable<boolean>;
  @Input("pages") pages:number = 0;
  @Input("FilterForm") FilterForm?:FormGroup<any>;
  currentPage:number = 0;
  SelectedRow:number = -1;
  itemsPrPage:number = 10;
  
  constructor(private carHttp:CarDataService){}
    
  ngOnInit(){
    this.RemoveFilters();
  }
    // stops click event from going to the parent of the element and either opens or closes a car row so some issues are visible
    SelectRow(index:number, event:Event){
      event.stopPropagation();
      if(this.SelectedRow == index){
        this.SelectedRow = -1;
        return;
      }
      else{
        if(this.cars![index].issues == null){
          this.carHttp.GetCarIssues(this.cars![index].id, 0, 3).subscribe({
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
        this.SelectedRow = index;
      }
    }
  
    searchForm = new FormGroup ({
      make: new FormControl(),
      model: new FormControl(),
      plate: new FormControl(),
      vinnr: new FormControl()
    })

    Search(){

    }

    RemoveFilters(){

    }

    ChangeNumberPrPage(event:Event){
      
    }

    JumpToPage(index:number){
      console.log(index);
      if(index < 0){
        index = 0;
      }
      this.currentPage = index;
      this.Search();
    }

    RemoveCar(event:Event){

    }
  
}
