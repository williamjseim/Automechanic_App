import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CarDataService } from '../../../services/car-data.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgIf, NgFor, NgStyle, NgClass, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { DeleteRequestPopupComponent } from '../../delete-request-popup/delete-request-popup.component';
import { Observable } from 'rxjs';
import { ColumnDefDirective } from '../../../Directives/column-def.directive';

@Component({
  selector: 'app-table-prefab',
  standalone: true,
  imports: [AsyncPipe, DatePipe, ColumnDefDirective, NgTemplateOutlet, KeyValuePipe, DeleteRequestPopupComponent, RouterLink, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './table-prefab.component.html',
  styleUrl: './table-prefab.component.scss'
})
export class TablePrefabComponent {

  //table data array
  @Input("items") items?:any[];
  //page index
  @Input("pages") pages:number = 0;
  //search filter for filtering table items
  @Input("FilterForm") FilterForm?:FormGroup<any>;
  //this is the column templates that make up the table
  @Input({required:true, alias:"columns"}) templates?:TemplateRef<any>[];
  //this is the expandable field under each row
  @Input({alias:"drawer"}) drawer?:TemplateRef<any>;
  //table headers
  @Input({required:true}) headers?:string[];
  
  @Output() PageChange = new EventEmitter<number>();
  @Output() AmountPrPage = new EventEmitter<number>();
  @Output() Search = new EventEmitter();
  @Output() RemoveFilter = new EventEmitter();
  @Output() DrawerOpened = new EventEmitter<number>();

  isAdmin?:Observable<boolean>;
  currentPage:number = 0;
  SelectedRow:number = -1;
  itemsPrPage:number = 10;

  expandSearch = false;
  
  constructor(private carHttp:CarDataService){}
  
  ngOnInit(){
    this.RemoveFilters();
  }
  // stops click event from going to the parent of the element and either opens or closes a car row so some issues are visible
  //emits -1 if no drawer is open
  SelectRow(index:number, event:Event){
    event.stopPropagation();
    if(this.drawer != null){
      if(this.SelectedRow == index || index == -1){
        this.SelectedRow = -1;
        return;
      }
      else{
        this.SelectedRow = index;
        this.DrawerOpened.emit(index);
      }
    }
  }

  RemoveFilters(){
    this.RemoveFilter.emit();
  }

  ChangeNumberPrPage(number:Event){
    this.itemsPrPage = JSON.parse((number.target as HTMLSelectElement).value)
    this.currentPage = 0;
    this.AmountPrPage.emit(this.itemsPrPage)
  }

  JumpToPage(index:number){
    console.log(index);
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    this.Search.emit();
  }

  RemoveCar(event:Event){

  }
  
}
