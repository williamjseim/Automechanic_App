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
  pages:number = 0;
  currentPage:number = 0;


  issues?:Issue[];
  itemprpage = 10;

  ngOnInit(){
    this.GetIssuePages(this.itemprpage);
    this.RemoveFilters();
  }

  test(item:any):string{
    return JSON.stringify(item)
  }

  searchForm = new FormGroup ({
    make: new FormControl(),
    plate: new FormControl(),
    username: new FormControl(),
    category: new FormControl(),
  })

  SelectRow(index:number, event:Event){}

  Search(skipGetPages: boolean = false){
    let category = this.searchForm.controls.category.value;
    let make = this.searchForm.controls.make.value;
    let plate = this.searchForm.controls.plate.value;
    let username = this.searchForm.controls.username.value;
    this.GetIssuesHttp(category, make, plate, username);
    if(!skipGetPages)
        this.GetIssuePages(this.itemprpage, category, make, plate, username);
  }

  RemoveFilters(){
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.username.reset("");
    this.searchForm.controls.category.reset("");
    this.Search();
  }
  RemoveIssue(event:number){}

  ChangeNumberPrPage(event:number){
    this.itemprpage = event;
    this.currentPage = 0;
    this.GetIssuePages(this.itemprpage);
    this.Search();
  }

  GetIssuesHttp(category: string  = "", make: string = "", plate: string = "", username: string = "") {
    this.carhttp.GetIssues(this.currentPage, this.itemprpage, category, make, plate, username).subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.issues = value.body;
        }
        else {
          this.issues = [];
        }
      },
    });
  }
  JumpToPage(index:number) {
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    this.Search();
  }

  GetIssuePages(itemprpage: number, username: string = "", make: string = "", plate: string = "", category: string = "" ){
     this.carhttp.GetIssuePageAmount(itemprpage, username, make, plate, category).subscribe({
      next: (res) => {
        this.pages = res
        if (this.currentPage >= this.pages) {
          this.currentPage = 0;
          this.Search(true);
        }
      },
     });
  }
}