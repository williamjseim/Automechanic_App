import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe} from '@angular/common';
import { NgStyle } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarDataService } from '../../services/car-data.service';
import { Issue } from '../../Interfaces/issue';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablePrefabComponent } from '../Prefabs/table-prefab/table-prefab.component';

@Component({
  selector: 'app-issuetablepage',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule, FormsModule, MatIconModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule, TablePrefabComponent],
  templateUrl: './issuetablepage.component.html',
  styleUrl: './issuetablepage.component.scss'
})
export class IssuetablepageComponent {
  constructor(private carhttp:CarDataService){}
  pages:number = 1;
  currentPage:number = 0;


  issues?:Issue[];
  itemprpage = 10;

  ngOnInit(){
    this.RemoveFilters();
  }

  test(item:any):string{
    return JSON.stringify(item)
  }

  searchForm = new FormGroup ({
    username: new FormControl(),
    make: new FormControl(),
    plate: new FormControl(),
  })

  SelectRow(index:number, event:Event){}

  Search(){
    let username = this.searchForm.controls.username.value;
    let make = this.searchForm.controls.make.value;
    let plate = this.searchForm.controls.plate.value;
    this.carhttp.GetIssues(this.currentPage, this.itemprpage, username, plate, make).subscribe({
      next:(value)=>{
        if(value.status == 200){
          this.issues = value.body;
          console.log(value.body);
        }
        else{
          this.issues = [];
        }
      },
      error:(err)=>{
        this.issues = [];
      }
    })
  }

  RemoveFilters(){
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.username.reset("");
    this.Search();
  }
  RemoveIssue(event:number){}

  ChangeNumberPrPage(event:number){
    this.itemprpage = event;
    this.currentPage = 0;
    this.GetIssuePages(this.itemprpage);
    this.Search();
  }

  JumpToPage(index:number){
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    this.Search();
  }

  GetIssuePages(itemprpage:number){

  }
}
