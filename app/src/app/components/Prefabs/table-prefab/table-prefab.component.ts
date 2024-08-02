import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, NgStyle, NgClass, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { DeleteRequestPopupComponent } from '../../delete-request-popup/delete-request-popup.component';

/**
 * TablePrefabComponent
 * 
 * This component provides a flexible table structure with support for paging, filtering, 
 * and row expansion. It allows customization of table columns, headers, and expandable content.
 */

@Component({
  selector: 'app-table-prefab',
  standalone: true,
  imports: [NgTemplateOutlet, KeyValuePipe, DeleteRequestPopupComponent, RouterLink, ReactiveFormsModule, FormsModule, MatIconModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule],
  templateUrl: './table-prefab.component.html',
  styleUrl: './table-prefab.component.scss'
})
export class TablePrefabComponent {

  //table data array
  @Input("items") items?:any[];
  @Input("DrawerTitle") drawerTitle?:string;
  //page index
  @Input("pages") pages:number = 0;
  //search filter for filtering table items
  @Input("FilterForm") FilterForm?:FormGroup<any>;
  //this is the column templates that make up the table
  @Input({required:true, alias:"columns"}) templates?:TemplateRef<any>[];
  //this is the expandable field under each row
  @Input({alias:"drawer"}) drawer?:TemplateRef<any>;
  @Input({alias:"openButton"}) openButton?:TemplateRef<any>;
  //table headers
  @Input({required:true}) headers?:string[];
  
  @Input() hideDelete: boolean = false; 
  @Input() hideAmountPrPage = false;
  //emits a number when the page index is changed
  @Output() PageChange = new EventEmitter<number>();
  //changes how many items pr page
  @Output() AmountPrPage = new EventEmitter<number>();
  //emits signal to search
  @Output() Search = new EventEmitter();
  //emits signal to remove filters from search
  @Output() RemoveFilter = new EventEmitter();
  //emits signal to delete item at index
  @Output() DeleteItem = new EventEmitter<number>();
  //emits signal that drawer was opened so data can be listed
  @Output() DrawerOpened = new EventEmitter<number>();
  //emits signal that stops propagation
  @Output() StopPropagation = new EventEmitter<Event>();

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange() {
    this.ChangeDetection.detectChanges();
  }

  //page index
  currentPage:number = 0;
  //what row in table to expand if needed
  SelectedRow:number = -1;
  //items pr page in table
  itemsPrPage:number = 10;

  expandSearch = false;

  orientation!:ScreenOrientation


  
  constructor(private ChangeDetection:ChangeDetectorRef){}
  
  ngOnInit(){
    this.RemoveFilters();
    this.orientation = window.screen.orientation;
  }
  // stops click event from going to the parent of the element and either opens or closes a car row so some issues are visible
  //emits -1 if no drawer is open
  //-2 opens the mobiles search drawer
  SelectRow(index:number, event:Event){
    this.StopPropagation.emit(event);
    event.stopPropagation();
    if(this.drawer != null){
      if(this.SelectedRow == index || index == -1){
        this.SelectedRow = -1;
        return;
      }
      else{
        this.SelectedRow = index;
        if(index >= 0){
          this.DrawerOpened.emit(index);
        }
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
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    // this.Search.emit();
    this.PageChange.emit(index);
  }

  RemoveCar(event:number){
    this.DeleteItem.emit(event);
  }
  
}
